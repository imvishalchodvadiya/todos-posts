import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import bcrypt from 'bcryptjs';

export const register = async (req, res, next) => {
  try {
    const _errors = validationResult(req);
    const _request = req.body;

    if (!_errors.isEmpty()) {
      return next(_errors);
    } else if (_request['password'] === _request['confirmPassword']) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(_request['password'], salt, async function (err, password) {
          const userData = {
            userId: uuidv4(),
            email: _request['email'].trim().toLowerCase(),
            firstName: _request['firstName'],
            lastName: _request['lastName'],
            country: _request['country'],
            phone: _request['phone'],
            password: password,
            roles: _request['role'],
            status: true,
          };

          const docUser = await userService.createUser(userData, next);

          return res.send({
            success: true,
            title: 'User register successfully!',
            message: 'User has been register successfully.',
            data: {
              user: docUser
            }
          });
        });
      });
    } else {
      return next({
        success: false,
        status: 400,
        title: 'Invalid request',
        message: 'Password and confirm password does not match and also make sure agree to our terms and conditions.'
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const _errors = validationResult(req);
    const _request = req.body;

    if (!_errors.isEmpty()) {
      return next(_errors);
    } else {
      const _user = {
        email: _request.email,
        password: _request.password,
      };
      if (_user.email && _user.password) {
        const mProjection = 'userId email password firstName lastName country phone roles';
        const _encryptedUser = await userService.getUser({ email: _user.email }, mProjection, next);

        if (_encryptedUser && _encryptedUser.email && _encryptedUser.email === _user.email) {
          bcrypt.compare(_user.password, _encryptedUser.password, async (err, data) => {
            if (data) {
              const tokenData = await authService.createToken(_encryptedUser, next);
              const token = {
                accessToken: tokenData.accessToken,
                refreshToken: tokenData.refreshToken,
                expiresIn: tokenData.expiresIn,
                loginUser: tokenData.loginUser
              };

              return res.send({
                success: true,
                title: 'Login Successful!',
                message: 'You have successfully login.',
                data: {
                  user: tokenData.loginUser,
                  accessToken: token.accessToken,
                  refreshToken: token.refreshToken
                }
              });
            } else {
              const loginData = {
                loginAttempts: req.rateLimit.current,
                moreAttempts: req.rateLimit.limit - req.rateLimit.current
              };
              let message = 'It seems that either your email or your password does not match.';
              if (loginData.loginAttempts && loginData.loginAttempts > 1) {
                if (loginData.moreAttempts === 0) {
                  message += ' Your account will be locked for 30 minutes.';
                } else if (loginData.moreAttempts === 1) {
                  message += ' You have ' + loginData.moreAttempts + ' more attempt before you are locked out.';
                } else {
                  message += ' You have ' + loginData.moreAttempts + ' more attempts before you are locked out.';
                }
              }
              return next({
                status: 400,
                title: 'Incorrect email or password!',
                message: message
              });
            }
          })
        } else {
          const loginData = {
            loginAttempts: req.rateLimit.current,
            moreAttempts: req.rateLimit.limit - req.rateLimit.current
          };
          let message = 'It seems that either your email or your password does not match.';
          if (loginData.loginAttempts && loginData.loginAttempts > 1) {
            if (loginData.moreAttempts === 0) {
              message += ' Your account will be locked for 30 minutes.';
            } else if (loginData.moreAttempts === 1) {
              message += ' You have ' + loginData.moreAttempts + ' more attempt before you are locked out. ';
            } else {
              message += ' You have ' + loginData.moreAttempts + ' more attempts before you are locked out. ';
            }
          }
          return next({
            status: 400,
            title: 'Incorrect email or password!',
            message: message
          });
        }
      } else {
        return next({
          status: 403,
          title: 'Invalid user data',
          message: 'Please check the user details and password validation properly.'
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const _request = req.body;

    if(_request['token']) {
      const tokenDoc = await authService.refreshToken(_request['token'], false, next);
      return res.send({
        success : true,
        title   : 'Login Successful!',
        message : 'You have successfully login.!',
        data    : {
          user: tokenDoc.loginUser,
          accessToken: tokenDoc.accessToken,
          refreshToken: tokenDoc.refreshToken
        }
      });
    } else {
      return next({
        status  : 402,
        title   : 'Invalid Request',
        message : 'Refresh token not found.'
      });
    }
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server error!',
      message : 'Sorry, due to an internal server error, we could not log you in with this email at this time.'
    });
  }
};
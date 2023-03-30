/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
const Token = mongoose.model('Token');

export const createToken = async (userData: { [x: string]: any; currentIp: any; }, next: (arg0: any) => any) => {
  try {
    return new Promise(async resolve => {
      const tokenUser = {
        userId: userData['userId'],
        email: userData['email'],
        phone: userData['phone'],
        roles: userData['roles'],
        country: userData['country'],
      };
      const _expiresInAccessToken = '15m';
      const _expiresIn = '30m';
      const accessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET, { 'expiresIn': _expiresInAccessToken });
      const refreshToken = jwt.sign(tokenUser, process.env.REFRESH_TOKEN_SECRET, { 'expiresIn': _expiresIn });
      const _tokenData = {
        tokenId: uuidv4(),
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: _expiresIn,
        loginIp: userData.currentIp,
        loginUser: tokenUser,
      };

      await Token.create(_tokenData).then((docToken) => {
        return resolve(docToken);
      }).catch((errUser) => {
        return next(errUser);
      });
    });
  } catch (error) {
    return next(error);
  }
};

export const authenticateToken = async (token: any, next: (arg0: { status: number; errors: any; title: string; message: string; }) => any) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
      if (err) {
        return next({
          status: 401,
          errors: err,
          title: 'Unauthorized User Token!',
          message: 'Sorry, we could authenticate user due to unauthorized user token.'
        });
      } else {
        return user;
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const authenticateRole = async (user: { [x: string]: { role: any; }[]; }, role: any, next: (arg0: any) => any) => {
  try {
    if (user && user['email'] && user['roles']) {
      for (let i = 0; i < user['roles'].length; i++) {
        if (user['roles'][i].role === role) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (refreshToken: any, userData: boolean, next: (arg0: { status: number; errors?: any; title: string; message: string; }) => any) => {
  try {
    return new Promise(async resolve => {
      await Token.findOne({ refreshToken: refreshToken }).then(async (docToken) => {
        if (docToken && docToken.refreshToken === refreshToken) {
          await jwt.verify(docToken.refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: any, user: {
            phone: any;
            roles: any; email: null; userId: any; country: any;
          }) => {
            if (err) {
              return next({
                status: 4021,
                errors: err,
                title: 'Unauthorized Request!',
                message: 'Unauthorized Request User.'
              });
            } else if (user.email == undefined || user.email == null) {
              return next({
                status: 4022,
                title: 'Unauthorized Request!',
                message: 'Unauthorized Request User.'
              });
            } else {
              const userData = {
                userId: user.userId,
                email: user.email,
                country: user.country,
                phone: user?.phone,
                roles: user?.roles,
              };
              const _expiresIn = '15m';
              const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: _expiresIn });

              const _tokenData = {
                accessToken: accessToken,
                loginUser: userData
              };

              await Token.findOneAndUpdate({ refreshToken: docToken.refreshToken}, _tokenData, { new: true }).then((tokenDoc) => {
                return resolve(tokenDoc);
              }).catch((tokenErr) => {
                return next(tokenErr);
              });
            }
          });
        } else {
          return next({
            status: 402,
            title: 'Unauthorized Request!',
            message: 'Unauthorized Request User.'
          });
        }
      }).catch((errTodo) => {
        return next(errTodo);
      });
    });
  } catch (error) {
    return next(error);
  }
};
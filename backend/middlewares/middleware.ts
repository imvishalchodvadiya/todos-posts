
import * as authService from '../services/auth.service';
import rateLimit from 'express-rate-limit';

export const authenticate = async (req, res, next) => {
  try {
    console.log( req.headers)
    let token;

    if (
      req.headers['authorization'] &&
      req.headers['authorization'].startsWith("Bearer")
    ) {
      token = req.headers['authorization'].split(" ")[1];
    } else if (req.session.jwt) {
      token = req.session.jwt;
    }
    if (token) {
      const currentUser = await authService.authenticateToken(token, next);
      if (!currentUser) {
        return next({
          status: 401,
          title: 'Unauthorized User !',
          message: 'Unauthorized Request. Token not found'
        });
      }
      req.user = currentUser;
      next();
    } else {
      return next({
        status: 401,
        title: 'Unauthorized User!',
        message: 'Unauthorized Request. Token not found'
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const accountLockoutPolicy = () => {
  const loginLimiter = rateLimit({
    skipSuccessfulRequests: true,
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 6,
    message: 'You have exceeded the limit for login attempts. Please try again in 30 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  return loginLimiter;
};
import { check } from 'express-validator';

export const login = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
  check('password', 'Your password is not valid').exists().notEmpty(),
];

export const register = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
  check('firstName', 'Your first name is not valid').exists().notEmpty(),
  check('lastName', 'Your last name is not valid').exists().notEmpty(),
  check('country', 'Your country is not valid').exists().notEmpty(),
  check('password', 'Your password is not valid, Please check the password requirements').exists().isLength({ min: 6, max: 50 }),
  check('confirmPassword', 'Your confirm password is not valid, Please check the password requirements').exists().notEmpty().isLength({ min: 6, max: 50 }),
  check('phone', 'Your phone number is not valid').exists().notEmpty(),
  check('role', 'Role is not valid').notEmpty().isIn(['admin', 'user']),
];

export const refreshToken = [
  check('token', 'refreshToken is not valid').notEmpty(),
];

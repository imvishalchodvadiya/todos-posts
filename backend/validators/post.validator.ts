import { check } from 'express-validator';

export const postCreate = [
  check('title', 'Title is not valid').notEmpty(),
  check('body', 'Body is not valid').notEmpty(),
];
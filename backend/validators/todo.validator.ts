import { check } from 'express-validator';

export const todoCreate = [
  check('title', 'Title is not valid').notEmpty(),
];


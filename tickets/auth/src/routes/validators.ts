import { body } from 'express-validator';

export const emailPasswordValidate = [
  body('email').isEmail().withMessage('Email must be valid.'),
  body('password')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Password length must be at least 2 and less than 20.'),
];

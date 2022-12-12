import { Request, Response, NextFunction } from 'express';
import { AjvValidationError } from '../errors';
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const emailPasswordSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' }
  },
  required: ['email', 'password'],
  additionalProperties: false
};

export const emailPassword = ajv.compile(emailPasswordSchema);

export const ValidateEmailPassword = (emailPassword: ValidateFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = emailPassword(req.body);
    if (!valid) {
      return next(new AjvValidationError(emailPassword.errors, 400));
    }
    next();
  };
};

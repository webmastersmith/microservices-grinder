import { Request, Response, NextFunction } from 'express';
import { UserType } from '../model/AuthSchema';
import Joi, { ObjectSchema, ValidationError } from 'joi';
import { JoiValidationError } from '../errors';

// convert Joi into middleware
export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (e) {
      if (e instanceof ValidationError) {
        next(new JoiValidationError(e));
      } else {
        next(new Error(String(e)));
      }
    }
  };
};

// create object with joy methods
export const Schema = {
  user: {
    create: Joi.object<UserType>({
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{2,5}$/i)
        .required()
    })
  }
};

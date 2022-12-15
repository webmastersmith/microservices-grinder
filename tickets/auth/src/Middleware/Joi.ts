import { Request, Response, NextFunction } from 'express';
import { IUser } from '../model/AuthSchema';
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
    create: Joi.object<IUser>({
      email: Joi.string().required().email(),
      password: Joi.string()
        .required()
        .regex(/^[a-zA-Z0-9]{2,5}$/i)
    }),
    update: Joi.object<IUser>({
      email: Joi.string().email(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{2,5}$/i)
    })
  }
};

import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import Log from '../library/Logging';
import { ValidationError as JoiValidationErr } from 'joi';

export const httpStatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  SERVICE_UNAVAILABLE: 503
};

// this will keep enforcing error schema after TS is translated.
abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
    // this allows 'instanceof' to correctly identify between Error and YourErrorName.
    // all extended classes will correctly identify with this code.
    Object.setPrototypeOf(this, new.target.prototype);
  }
  abstract serializeErrors(): { msg: string; field: string }[];
}

export class RequestValidationError extends CustomError {
  constructor(public statusCode: number = httpStatusCodes.BAD_REQUEST, public errors: ValidationError[]) {
    super('Express-Validator Error.');
  }

  serializeErrors() {
    return this.errors.map((e) => ({
      msg: e.msg,
      field: e.param
    }));
  }
}
export class JoiValidationError extends CustomError {
  statusCode = httpStatusCodes.BAD_REQUEST;
  constructor(public error: JoiValidationErr) {
    super('Joi-Validation Error.');
  }

  // serializeErrors() {
  //   return this.errors.map((e) => ({
  //     msg: '',
  //     field: ''
  //   }));
  // }
  serializeErrors() {
    return [
      {
        msg: this.message,
        field: 'Database Error',
        err: this.error
      }
    ];
  }
}
export class AjvValidationError extends CustomError {
  // attaches statusCode and Errors Array to error.
  constructor(public errors: any, public statusCode: number = httpStatusCodes.BAD_REQUEST) {
    super('Ajv-Validation Error.');
  }

  serializeErrors() {
    return this.errors.map((e: any) => ({
      msg: e.message,
      field: e.params
    }));
  }
}

export class DatabaseError extends CustomError {
  constructor(public statusCode: number = httpStatusCodes.INTERNAL_SERVER, public err?: Error) {
    super('Database Connection Error');
  }
  serializeErrors() {
    return [
      {
        msg: this.message,
        field: 'Database Error',
        err: this.err?.stack || ''
      }
    ];
  }
}
export class RouteError extends CustomError {
  constructor(public statusCode: number = httpStatusCodes.NOT_FOUND) {
    super('Route Not Found.');
  }
  serializeErrors() {
    return [
      {
        msg: this.message,
        field: 'Route Error'
      }
    ];
  }
}

export const errorHandler = (err: JoiValidationError | RequestValidationError | DatabaseError | Error, req: Request, res: Response, next: NextFunction) => {
  // if (err instanceof AjvValidationError) {
  //   Log.error(JSON.stringify(err, null, 2));
  //   return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  // }
  if (err instanceof JoiValidationError) {
    Log.error(JSON.stringify(err, null, 2));
    return res.status(err.statusCode).json({ errors: err });
  }
  Log.error(err.stack);
  if (err instanceof CustomError) return res.status(err.statusCode).json({ errors: err.serializeErrors() });

  // generic error
  res.status(httpStatusCodes.BAD_REQUEST).json({
    errors: [
      {
        msg: err.message,
        field: 'error'
      }
    ]
  });
};

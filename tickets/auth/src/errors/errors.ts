import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}

export class DatabaseError extends Error {
  reason = 'Error connecting to database.';
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export const errorHandler = (
  err: RequestValidationError | DatabaseError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map((e) => ({
      msg: e.msg,
      field: e.param,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }

  if (err instanceof DatabaseError) {
    return res.status(503).json({
      errors: [
        {
          msg: err.reason,
          field: 'database',
        },
      ],
    });
  }

  // generic error
  res.status(400).json({
    errors: [
      {
        msg: err.message,
        field: 'error',
      },
    ],
  });
};

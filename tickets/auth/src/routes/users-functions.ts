import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import { validationResult, ValidationError } from 'express-validator';
import {
  RequestValidationError,
  DatabaseError,
  httpStatusCodes,
} from '../errors';

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new RequestValidationError(
      httpStatusCodes.BAD_REQUEST,
      errors.array()
    );

  const { email, password } = req.body;
  // throw new DatabaseError(httpStatusCodes.BAD_REQUEST);
  // throw new Error('my bad!');

  res
    .status(200)
    .json({ data: { email, password }, msg: 'Email Password Success!' });
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ data: 'please provide email and password' });
  res
    .status(200)
    .json({ data: { email, password }, msg: 'Email Password Success!' });
}

export async function signOut(req: Request, res: Response, next: NextFunction) {
  // const { email, password } = req.body;
  // if (!email || !password)
  //   return res.status(400).json({ data: 'please provide email and password' });
  res.status(200).json({ data: {}, msg: 'Sign out successful!' });
}

export async function currentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const { email, password } = req.body;
  // if (!email || !password)
  //   return res.status(400).json({ data: 'please provide email and password' });
  res.status(200).json({ data: { user: {} }, msg: 'Current User' });
}

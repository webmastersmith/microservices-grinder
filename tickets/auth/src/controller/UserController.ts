import { Request, Response, NextFunction } from 'express';
// import { validationResult, ValidationError } from 'express-validator';
// import { RequestValidationError, DatabaseError, httpStatusCodes, AjvValidationError } from '../errors';
import { Auth, IUser, IUserDocument } from '../model/AuthSchema';
import Log from '../library/Logging';
// import { config } from '../config';

// user CRUD
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const user = req.body;
  if (!user) return next(new Error('Login to get user.'));
  const completeUser = await Auth.findById(user._id, 'email, +password, id');
  Log.warn(completeUser);

  Log.warn(req.body.user, __filename, getUser.name);
  res.status(200).json(req.body.user);
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  Log.warn(req.body.user, __filename, getAllUsers.name);
  res.status(200).json(req.body.user);
}
export async function updateUser(req: Request, res: Response, next: NextFunction) {
  Log.warn(req.body.user, __filename, updateUser.name);
  res.status(200).json(req.body.user);
}
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  Log.warn(req.body.user, __filename, deleteUser.name);
  res.status(200).json(req.body.user);
}

export async function currentUser(req: Request, res: Response, next: NextFunction) {
  // const { email, password } = req.body;
  // if (!email || !password)
  //   return res.status(400).json({ data: 'please provide email and password' });
  const user = await Auth.findById('6398f65b0e30b4b9e8a52f25');
  Log.warn(user);
  res.status(200).json(user);
}

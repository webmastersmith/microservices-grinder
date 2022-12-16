import { Request, Response, NextFunction } from 'express';
// import { validationResult, ValidationError } from 'express-validator';
// import { RequestValidationError, DatabaseError, httpStatusCodes, AjvValidationError } from '../errors';
import { Auth, IUser, IUserDocument } from '../model/AuthSchema';
import Log from '../library/Logging';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export async function signIn(req: Request, res: Response, next: NextFunction) {
  // valid user

  // if (!email || !password) throw new Error('email and password are required.');
  // throw new DatabaseError(httpStatusCodes.BAD_REQUEST);
  // throw new Error('my bad!');
  // Log.warn(me);
  // const me2 = await CreateUser({ email, password }).save();
  Log.warn(req.body.user, __filename, signIn.name);

  res.status(200).json(req.body.user);
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const user = await Auth.create(req.body);
  // create jwt
  const signedJwt = jwt.sign({ email: user.email, id: user.id }, config.jwt.secret, { expiresIn: Date.now() + 10 * 60 * 1000 });
  // store on the session object (cookie)
  Log.warn(signedJwt, __filename, signUp.name);
  req.session = {
    jwt: signedJwt
  };

  // Log.warn(user, __filename, signUp.name);
  res.status(200).json(user);
}

export async function signOut(req: Request, res: Response, next: NextFunction) {
  // const { email, password } = req.body;
  // if (!email || !password)
  //   return res.status(400).json({ data: 'please provide email and password' });
  res.status(200).json({ data: {}, msg: 'Sign out successful!' });
}

export async function currentUser(req: Request, res: Response, next: NextFunction) {
  // const { email, password } = req.body;
  // if (!email || !password)
  //   return res.status(400).json({ data: 'please provide email and password' });
  const user = await Auth.findById('6398f65b0e30b4b9e8a52f25');
  Log.warn(user);
  res.status(200).json(user);
}

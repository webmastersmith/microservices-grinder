import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import Log from './Logging';
const scryptAsync = promisify(scrypt);
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../model/AuthSchema';

export class Password {
  static async hash(pw: string, salt = randomBytes(16).toString('hex')) {
    try {
      const buf = (await scryptAsync(pw, salt, 64)) as Buffer;
      return `${buf.toString('hex')}.${salt}`;
    } catch (e) {
      Log.error(e);
      throw new Error('password could not be hashed.');
    }
  }

  static async check(hashPlusSalt: string, providedPassword: string) {
    try {
      const providedHashPlusSalt = await Password.hash(providedPassword, hashPlusSalt.split('.')[1]);
      return hashPlusSalt === providedHashPlusSalt;
    } catch (e) {
      Log.error(e);
      throw new Error('password check errored.');
    }
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  // data is validated through mongoose.
  const { email, password } = req.body;
  // find user id
  const user = await Auth.findOne({ email }, ['email', 'password']).exec();
  const msg = 'something went wrong with email or password.';
  if (!user) return next(new Error(`${msg} (A)`));
  // check password
  const isValid = await Auth.checkPassword(user?.password, password);
  if (!isValid) return next(new Error(`${msg} (B)`));
  Log.warn(user, __filename, protect.name);
  user.password = '';
  req.body.user = user;
  next();
}

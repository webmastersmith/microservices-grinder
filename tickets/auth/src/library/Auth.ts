import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import Log from './Logging';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../model/AuthSchema';
import { config } from '../config';
import JWT from 'jsonwebtoken';
const scryptAsync = promisify(scrypt);

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
  static signJwt(user: { email: string; id: string }) {
    return JWT.sign({ email: user.email, id: user.id }, config.jwt.secret, { expiresIn: '2h' });
  }
}

interface JWT_Type {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  let user;
  const msg = 'something went wrong with email or password.';
  // check if jwt is valid for user?
  if (req.session?.jwt) {
    // const {email, id, iat, exp} = JWT.verify(req.session?.jwt, config.jwt.secret) as JWT_Type;
    const { email, id } = JWT.verify(req.session?.jwt, config.jwt.secret) as JWT_Type;
    user = await Auth.findById(id, 'email');
    if (!user || user.email !== email) return next(new Error(`${msg} (A)`));

    // session token missing, sign in by email and password.
  } else {
    // data is validated through mongoose.
    const { email, password } = req.body;
    await Auth.validate({ email, password }, ['email', 'password']);
    // if session cookie found, user is already on body.
    // find user id
    user = await Auth.findOne({ email }, 'email +password').exec();

    if (!user) return next(new Error(`${msg} (A)`));
    Log.warn(user, __filename, protect.name);
    // check password
    const isValid = await Auth.checkPassword(user?.password, password);
    if (!isValid) return next(new Error(`${msg} (B)`));
  }

  req.session = {
    jwt: Auth.signJwt(user)
  };
  user.password = '';
  req.body.user = user;
  next();
}

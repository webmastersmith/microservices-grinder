import { Schema, model, Model, Types, HydratedDocument } from 'mongoose';
import { isNumberObject } from 'util/types';
// import crypto from 'crypto';
// import { config } from '../config';
import { Password } from '../library/Auth';

export interface IUser {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
}

// single document methods. 'this' will have access to the HydratedDocument object
export interface IUserDocument {
  details(): string;
}

// static methods Model has
export interface IUserModel extends Model<IUser, {}, IUserDocument> {
  hashPassword: (pw: string) => Promise<string>;
  checkPassword: (hash: string, salt?: string) => Promise<boolean>;
  build(attrs: IUser): Promise<HydratedDocument<IUser, IUserDocument>>;
}

const userSchema = new Schema<IUser, IUserModel, IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true
      // maxLength: [40, 'Email cannot be over 40 characters.'],
      // minLength: [3, 'Valid email cannot be less than 3 characters.'],
      // validate: {
      //   validator: (email: string) => validator.isEmail(email),
      //   message: (props: { value: string }) => `${props.value} is not a valid email.`
      // }
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false
      // minLength: [2, 'Password needs to longer than 2 characters'],
      // maxLength: [4, 'Password needs to shorter than 5 characters']
      // validate: {
      //   validator: function (val: string) {
      //     Log.warn(`password this ${this}`);
      //     Log.warn(`value passed to function ${val}`);
      //     // (this) // logs 'tourSchema' object
      //     return validator.isAlphanumeric(val, 'en-US', { ignore: ' ' });
      //   },
      //   message: (props: { value: string }) => `${props.value} can only contain numbers and letters.`
      // }
    }
  }
  // {
  //   // you must add this in to see virtuals on results for all.
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true }
  // }
);

// export const hashPassword = async (password: string, salt: string) => crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

// Virtuals -'this' must use function keyword.
userSchema.virtual('fullName').get(function () {
  return this.email + ' ' + this.password;
});

// Document Methods
userSchema.method('details', function () {
  return this.email + this.password;
});

// Model Methods
userSchema.static('hashPassword', Password.hash);
userSchema.static('checkPassword', Password.check);
// 'build' create's user with typescript validation.
userSchema.static('build', (attrs: IUser) => new Auth(attrs));

// Document Middleware 'pre', 'post'.
userSchema.pre('save', async function (next) {
  this.set('password', await Password.hash(this.get('password')));
  return next();
});

export const Auth = model<IUser, IUserModel>('users', userSchema);

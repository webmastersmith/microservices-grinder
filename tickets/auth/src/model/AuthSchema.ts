import mongoose, { Schema, model, Model, QueryOptions, Types } from 'mongoose';
import crypto from 'crypto';
import { config } from '../config';
import validator from 'validator';
import Log from '../library/Logging';

export interface UserType {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
}

export interface UserTypeMethods {}

export interface UserModel extends Model<UserType, {}, UserTypeMethods> {
  hashMyPassword: (pw: string, salt: string) => Promise<string>;
}

const userSchema = new Schema<UserType, UserModel, UserTypeMethods>({
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
    select: false,
    minLength: [2, 'Password needs to longer than 2 characters'],
    maxLength: [4, 'Password needs to shorter than 5 characters']
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
});

export const hashPassword = async (password: string, salt: string) => crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

userSchema.static('hashPassword', hashPassword);

userSchema.pre('save', async function (next) {
  this.password = await hashPassword(this.password, config.password.salt);
  return next();
});

export const Auth = model<UserType, UserModel>('users', userSchema);

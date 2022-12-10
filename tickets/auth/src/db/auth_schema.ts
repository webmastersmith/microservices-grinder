import mongoose, { Schema, model, Model, QueryOptions, Types } from 'mongoose';
import crypto from 'crypto';

export interface UserType {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  salt: string;
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
    lowercase: true,
    maxLength: [40, 'Email cannot be over 40 characters.'],
    minLength: [3, 'Valid email cannot be less than 3 characters.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    trim: true,
    select: false,
    maxLength: [40, 'Password cannot be over 40 characters.'],
    minLength: [4, 'Password cannot be less than 4 characters.'],
  },
  salt: String,
});

export const hashPassword = async (password: string, salt: string) =>
  crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

userSchema.static('hashMyPassword', hashPassword);

userSchema.pre('save', async function (next) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = await hashPassword(this.password, this.salt);
  return next();
});

export const User = model<UserType, UserModel>('User', userSchema);

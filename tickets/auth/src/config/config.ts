import 'dotenv/config';

const SALT = process.env.SALT || '';
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';

export const config = {
  password: {
    salt: SALT
  },
  mongo: {
    user: MONGO_USER,
    password: MONGO_PASSWORD
  }
};

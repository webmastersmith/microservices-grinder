import 'dotenv/config';

const SALT = process.env.SALT || '';
const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const DEV = process.env.NODE_ENV || 'production';

export const config = {
  password: {
    salt: SALT
  },
  mongo: {
    user: MONGO_USER,
    password: MONGO_PASSWORD
  },
  jwt: {
    secret: JWT_SECRET
  },
  dev: {
    env: DEV
  }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const SALT = process.env.SALT || '';
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const DEV = process.env.NODE_ENV || 'production';
exports.config = {
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

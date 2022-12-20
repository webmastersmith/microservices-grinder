"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const mongoose_1 = require("mongoose");
// import crypto from 'crypto';
// import { config } from '../config';
const Auth_1 = require("../library/Auth");
const validator_1 = __importDefault(require("validator"));
const Logging_1 = __importDefault(require("../library/Logging"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        maxLength: [40, 'Email cannot be over 40 characters.'],
        minLength: [3, 'Valid email cannot be less than 3 characters.'],
        validate: {
            validator: (email) => validator_1.default.isEmail(email),
            message: (props) => `${props.value} is not a valid email.`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        select: false,
        minLength: [2, 'Password needs to longer than 2 characters'],
        maxLength: [4, 'Password needs to shorter than 5 characters'],
        validate: {
            validator: function (val) {
                Logging_1.default.warn(`password this ${this}`);
                Logging_1.default.warn(`value passed to function ${val}`);
                // (this) // logs 'tourSchema' object
                return validator_1.default.isAlphanumeric(val, 'en-US', { ignore: ' ' });
            },
            message: (props) => `${props.value} can only contain numbers and letters.`
        }
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
userSchema.static('hashPassword', Auth_1.Password.hash);
userSchema.static('checkPassword', Auth_1.Password.check);
userSchema.static('signJwt', Auth_1.Password.signJwt);
// 'build' create's user with typescript validation.
userSchema.static('build', (attrs) => new exports.Auth(attrs));
// Document Middleware 'pre', 'post'.
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.set('password', yield Auth_1.Password.hash(this.get('password')));
        return next();
    });
});
exports.Auth = (0, mongoose_1.model)('users', userSchema);

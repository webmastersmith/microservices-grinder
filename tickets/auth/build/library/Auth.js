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
exports.protect = exports.Password = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const Logging_1 = __importDefault(require("./Logging"));
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
const AuthSchema_1 = require("../model/AuthSchema");
class Password {
    static hash(pw, salt = (0, crypto_1.randomBytes)(16).toString('hex')) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buf = (yield scryptAsync(pw, salt, 64));
                return `${buf.toString('hex')}.${salt}`;
            }
            catch (e) {
                Logging_1.default.error(e);
                throw new Error('password could not be hashed.');
            }
        });
    }
    static check(hashPlusSalt, providedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providedHashPlusSalt = yield Password.hash(providedPassword, hashPlusSalt.split('.')[1]);
                return hashPlusSalt === providedHashPlusSalt;
            }
            catch (e) {
                Logging_1.default.error(e);
                throw new Error('password check errored.');
            }
        });
    }
}
exports.Password = Password;
function protect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // data is validated through mongoose.
        const { email, password } = req.body;
        // find user id
        const user = yield AuthSchema_1.Auth.findOne({ email }, ['email', 'password']).exec();
        const msg = 'something went wrong with email or password.';
        if (!user)
            return next(new Error(`${msg} (A)`));
        // check password
        const isValid = yield AuthSchema_1.Auth.checkPassword(user === null || user === void 0 ? void 0 : user.password, password);
        if (!isValid)
            return next(new Error(`${msg} (B)`));
        Logging_1.default.warn(user, __filename, protect.name);
        user.password = '';
        req.body.user = user;
        next();
    });
}
exports.protect = protect;

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
const AuthSchema_1 = require("../model/AuthSchema");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
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
    static signJwt(user) {
        return jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, config_1.config.jwt.secret, { expiresIn: '2h' });
    }
}
exports.Password = Password;
function protect(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        const msg = 'something went wrong with email or password.';
        // check if jwt is valid for user?
        if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt) {
            // const {email, id, iat, exp} = JWT.verify(req.session?.jwt, config.jwt.secret) as JWT_Type;
            const { email, id } = jsonwebtoken_1.default.verify((_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt, config_1.config.jwt.secret);
            user = yield AuthSchema_1.Auth.findById(id, 'email');
            if (!user || user.email !== email)
                return next(new Error(`${msg} (A)`));
            // session token missing, sign in by email and password.
        }
        else {
            // data is validated through mongoose.
            const { email, password } = req.body;
            yield AuthSchema_1.Auth.validate({ email, password }, ['email', 'password']);
            // if session cookie found, user is already on body.
            // find user id
            user = yield AuthSchema_1.Auth.findOne({ email }, 'email +password').exec();
            if (!user)
                return next(new Error(`${msg} (A)`));
            Logging_1.default.warn(user, __filename, protect.name);
            // check password
            const isValid = yield AuthSchema_1.Auth.checkPassword(user === null || user === void 0 ? void 0 : user.password, password);
            if (!isValid)
                return next(new Error(`${msg} (B)`));
        }
        req.session = {
            jwt: AuthSchema_1.Auth.signJwt(user)
        };
        user.password = '';
        req.body.user = user;
        next();
    });
}
exports.protect = protect;

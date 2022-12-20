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
exports.signOut = exports.signUp = exports.signIn = void 0;
// import { validationResult, ValidationError } from 'express-validator';
// import { RequestValidationError, DatabaseError, httpStatusCodes, AjvValidationError } from '../errors';
const AuthSchema_1 = require("../model/AuthSchema");
const Logging_1 = __importDefault(require("../library/Logging"));
function signIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // valid user
        // if (!email || !password) throw new Error('email and password are required.');
        // throw new DatabaseError(httpStatusCodes.BAD_REQUEST);
        // throw new Error('my bad!');
        // Log.warn(me);
        // const me2 = await CreateUser({ email, password }).save();
        Logging_1.default.warn(req.body.user, __filename, signIn.name);
        res.status(200).json(req.body.user);
    });
}
exports.signIn = signIn;
function signUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // wait for index's to build before creating item.
        yield AuthSchema_1.Auth.init();
        const user = yield AuthSchema_1.Auth.create(req.body);
        // create jwt
        const signedJwt = AuthSchema_1.Auth.signJwt(user);
        // store on the session object (cookie)
        Logging_1.default.warn(signedJwt, __filename, signUp.name);
        req.session = {
            jwt: signedJwt
        };
        // Log.warn(user, __filename, signUp.name);
        res.status(200).json(user);
    });
}
exports.signUp = signUp;
function signOut(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // const { email, password } = req.body;
        // if (!email || !password)
        //   return res.status(400).json({ data: 'please provide email and password' });
        res.status(200).json({ data: {}, msg: 'Sign out successful!' });
    });
}
exports.signOut = signOut;

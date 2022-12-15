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
exports.currentUser = exports.signOut = exports.signUp = exports.signIn = void 0;
require("dotenv/config");
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
        const user = yield AuthSchema_1.Auth.create(req.body);
        Logging_1.default.warn(user, __filename, signUp.name);
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
function currentUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // const { email, password } = req.body;
        // if (!email || !password)
        //   return res.status(400).json({ data: 'please provide email and password' });
        const user = yield AuthSchema_1.Auth.findById('6398f65b0e30b4b9e8a52f25');
        Logging_1.default.warn(user);
        res.status(200).json(user);
    });
}
exports.currentUser = currentUser;

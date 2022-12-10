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
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = exports.signOut = exports.signUp = exports.signIn = void 0;
require("dotenv/config");
const express_validator_1 = require("express-validator");
const errors_1 = require("../errors");
function signIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            throw new errors_1.RequestValidationError(errors_1.httpStatusCodes.BAD_REQUEST, errors.array());
        const { email, password } = req.body;
        // throw new DatabaseError(httpStatusCodes.BAD_REQUEST);
        // throw new Error('my bad!');
        res
            .status(200)
            .json({ data: { email, password }, msg: 'Email Password Success!' });
    });
}
exports.signIn = signIn;
function signUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ data: 'please provide email and password' });
        res
            .status(200)
            .json({ data: { email, password }, msg: 'Email Password Success!' });
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
        res.status(200).json({ data: { user: {} }, msg: 'Current User' });
    });
}
exports.currentUser = currentUser;

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
exports.currentUser = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUser = void 0;
// import { validationResult, ValidationError } from 'express-validator';
// import { RequestValidationError, DatabaseError, httpStatusCodes, AjvValidationError } from '../errors';
const AuthSchema_1 = require("../model/AuthSchema");
const Logging_1 = __importDefault(require("../library/Logging"));
// import { config } from '../config';
// user CRUD
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        if (!user)
            return next(new Error('Login to get user.'));
        const completeUser = yield AuthSchema_1.Auth.findById(user._id, 'email, +password, id');
        Logging_1.default.warn(completeUser);
        Logging_1.default.warn(req.body.user, __filename, getUser.name);
        res.status(200).json(req.body.user);
    });
}
exports.getUser = getUser;
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        Logging_1.default.warn(req.body.user, __filename, getAllUsers.name);
        res.status(200).json(req.body.user);
    });
}
exports.getAllUsers = getAllUsers;
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        Logging_1.default.warn(req.body.user, __filename, updateUser.name);
        res.status(200).json(req.body.user);
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        Logging_1.default.warn(req.body.user, __filename, deleteUser.name);
        res.status(200).json(req.body.user);
    });
}
exports.deleteUser = deleteUser;
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

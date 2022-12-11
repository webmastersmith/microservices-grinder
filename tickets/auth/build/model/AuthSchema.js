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
exports.Auth = exports.hashPassword = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        maxLength: [40, 'Email cannot be over 40 characters.'],
        minLength: [3, 'Valid email cannot be less than 3 characters.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        select: false
    },
    salt: String
});
const hashPassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () { return crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`); });
exports.hashPassword = hashPassword;
userSchema.static('hashPassword', exports.hashPassword);
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield (0, exports.hashPassword)(this.password, config_1.config.password.salt);
        return next();
    });
});
exports.Auth = (0, mongoose_1.model)('users', userSchema);

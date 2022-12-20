"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controller/AuthController");
const UserController_1 = require("../controller/UserController");
const Joi_1 = require("../Middleware/Joi");
const Auth_1 = require("../library/Auth");
// import { emailPasswordValidate } from '../Middleware/AuthValidator';
// import { ValidateEmailPassword, emailPassword } from '../Middleware/AJV';
const router = express_1.default.Router();
// http://tickets.prod/api/v1/users/signin
// Auth
router.route('/signin').post((0, Joi_1.ValidateSchema)(Joi_1.Schema.user.create), Auth_1.protect, AuthController_1.signIn);
router.route('/signup').post((0, Joi_1.ValidateSchema)(Joi_1.Schema.user.create), AuthController_1.signUp);
router.route('/signout').post(AuthController_1.signOut);
// User
router.route('/user').get(Auth_1.protect, UserController_1.getUser).patch(Auth_1.protect, UserController_1.updateUser).delete(Auth_1.protect, UserController_1.deleteUser);
exports.default = router;

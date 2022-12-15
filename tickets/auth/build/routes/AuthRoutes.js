"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controller/AuthController");
const Joi_1 = require("../Middleware/Joi");
const Auth_1 = require("../library/Auth");
// import { emailPasswordValidate } from '../Middleware/AuthValidator';
// import { ValidateEmailPassword, emailPassword } from '../Middleware/AJV';
// Users
const router = express_1.default.Router();
// http://tickets.prod/api/v1/users/signin
router.route('/signin').post((0, Joi_1.ValidateSchema)(Joi_1.Schema.user.create), Auth_1.protect, AuthController_1.signIn);
router.route('/signup').post((0, Joi_1.ValidateSchema)(Joi_1.Schema.user.create), AuthController_1.signUp);
router.route('/signout').post(AuthController_1.signOut);
router.route('/currentuser').get(AuthController_1.currentUser);
exports.default = router;

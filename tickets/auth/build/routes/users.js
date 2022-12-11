"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controller/AuthController");
const validators_1 = require("./validators");
// Users
const router = express_1.default.Router();
// http://tickets.prod/api/v1/users/signin
router.route('/signin').post(validators_1.emailPasswordValidate, AuthController_1.signIn);
router.route('/signup').post(AuthController_1.signUp);
router.route('/signout').post(AuthController_1.signOut);
router.route('/currentuser').get(AuthController_1.currentUser);
exports.default = router;

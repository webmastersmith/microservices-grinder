"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_functions_1 = require("./users-functions");
const validators_1 = require("./validators");
// Users
const router = express_1.default.Router();
// signup
// http://tickets.prod/api/v1/users/signin
router.route('/signin').post(validators_1.emailPasswordValidate, users_functions_1.signIn);
// // login
router.route('/signup').post(users_functions_1.signUp);
router.route('/signout').post(users_functions_1.signOut);
router.route('/currentuser').get(users_functions_1.currentUser);
// // forgotPassword
// router.route('/forgotPassword').post(forgotPassword);
// // resetPassword
// router.route('/resetPassword/:token').patch(resetPassword);
// // updatePassword logged in user.
// router.route('/updatePassword').patch(protect, updatePassword);
// // update user info
// router
//   .route('/updateMe')
//   .patch(protect, updateUser)
//   .delete(protect, deleteUser);
// // get all Users -admin only
// router.route('/').get(protect, approvedRoles('admin'), getAllUsers);
// // updateUser Info
// router
//   .route('/:id')
//   .get(protect, approvedRoles('admin'), getUser)
//   .patch(protect, approvedRoles('admin'), updateUser)
//   .delete(protect, approvedRoles('admin'), deleteUser);
exports.default = router;

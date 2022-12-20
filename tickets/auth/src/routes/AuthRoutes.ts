import express from 'express';
import { signIn, signUp, signOut } from '../controller/AuthController';
import { getUser, deleteUser, getAllUsers, updateUser } from '../controller/UserController';
import { Schema, ValidateSchema } from '../Middleware/Joi';
import { protect } from '../library/Auth';
// import { emailPasswordValidate } from '../Middleware/AuthValidator';
// import { ValidateEmailPassword, emailPassword } from '../Middleware/AJV';

const router = express.Router();
// http://tickets.prod/api/v1/users/signin
// Auth
router.route('/signin').post(ValidateSchema(Schema.user.create), protect, signIn);
router.route('/signup').post(ValidateSchema(Schema.user.create), signUp);
router.route('/signout').post(signOut);
// User
router.route('/user').get(protect, getUser).patch(protect, updateUser).delete(protect, deleteUser);

export default router;

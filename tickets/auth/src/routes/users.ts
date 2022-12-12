import express from 'express';
import { signIn, signUp, signOut, currentUser } from '../controller/AuthController';
import { Schema, ValidateSchema } from '../Middleware/Joi';
// import { emailPasswordValidate } from '../Middleware/AuthValidator';
// import { ValidateEmailPassword, emailPassword } from '../Middleware/AJV';

// Users
const router = express.Router();
// http://tickets.prod/api/v1/users/signin
router.route('/signin').post(ValidateSchema(Schema.user.create), signIn);
router.route('/signup').post(signUp);
router.route('/signout').post(signOut);
router.route('/currentuser').get(currentUser);

export default router;

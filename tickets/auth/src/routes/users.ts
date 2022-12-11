import express from 'express';
import { signIn, signUp, signOut, currentUser } from '../controller/AuthController';
import { emailPasswordValidate } from './validators';

// Users
const router = express.Router();
// http://tickets.prod/api/v1/users/signin
router.route('/signin').post(emailPasswordValidate, signIn);
router.route('/signup').post(signUp);
router.route('/signout').post(signOut);
router.route('/currentuser').get(currentUser);

export default router;

import express from 'express';
import { signIn, signUp, signOut, currentUser } from './users-functions';

// Users
const router = express.Router();
// signup
// http://tickets.prod/api/v1/users/signin
router.route('/signin').post(signIn);
// // login
router.route('/signup').post(signUp);
router.route('/signout').post(signOut);
router.route('/currentuser').get(currentUser);
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

export default router;

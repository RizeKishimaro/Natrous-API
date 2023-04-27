const express = require('express');
const routers = express.Router();
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');
const functionFactory = require('./../controllers/functionFactory');

routers.get(
  '/me',
  authControllers.protect,
  functionFactory.getMe,
  userControllers.getUser
);
routers.post('/signup', authControllers.signUpUser);
routers.post('/login', authControllers.loginUser);
routers.post('/forgotPassword', authControllers.forgetPassword);
routers.patch('/resetPassword/:token', authControllers.resetPassword);

routers.use(authControllers.protect);
routers.post('/updatePassword', authControllers.updatePassword);
routers.patch(
  '/updateData',
  authControllers.protect,
  userControllers.updateUserData
);
routers.delete(
  '/deactivateAccount',
  authControllers.protect,
  userControllers.deleteUserData
);

routers.use(authControllers.allowedRole('admin'));
routers
  .route('/')
  .get(authControllers.protect, userControllers.getAllUsers)
  .post(userControllers.createUser);

routers
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = routers;

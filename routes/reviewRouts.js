const express = require('express');
const authController = require('../controllers/authControllers');
const reviewControllers = require('../controllers/reviewControllers');
const reviewRouters = express.Router({ mergeParams: true });
const functionFactory = require('./../controllers/functionFactory');

reviewRouters.use(authController.protect);
reviewRouters
  .route('/:id')
  .get(reviewControllers.getReview)
  .delete(reviewControllers.deleteReview)
  .patch(reviewControllers.updateReview);
reviewRouters
  .route('/')
  .get(
    authController.protect,
    authController.allowedRole('user', 'admin'),
    reviewControllers.getAllReviews
  )
  .post(
    authController.protect,
    authController.allowedRole('user', 'admin'),
    functionFactory.checkParamsInReq,
    reviewControllers.createReview
  );

module.exports = reviewRouters;

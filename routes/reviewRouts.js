const express = require('express');
const authController = require('../controllers/authControllers');
const reviewControllers = require('../controllers/reviewControllers');
const reviewRouters = express.Router();

reviewRouters
  .route('/')
  .get(
    authController.protect,
    authController.allowedRole('user'),
    reviewControllers.getAllReviews
  )
  .post(
    authController.protect,
    authController.allowedRole('user'),
    reviewControllers.createReview
  );

module.exports = reviewRouters;

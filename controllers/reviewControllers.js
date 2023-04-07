const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchError');
const functionFactory = require("./functionFactory");
exports.getAllReviews = functionFactory.getAllData(Review);
exports.getReview = functionFactory.getTourById(Review)
exports.createReview = functionFactory.createReqData(Review);
exports.deleteReview = functionFactory.deleteReqData(Review);
exports.updateReview = functionFactory.updateReqData(Review);
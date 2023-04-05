const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchError');
const functionFactory = require("./functionFactory");
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if(req.params.tourId) filter = {tour: req.params.tourId}
  const review = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: review.length,
    data: { review },
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  if(!req.body.tours) req.body.tours = req.params.tourId;
  if(!req.body.users) req.body.users = req.user.id;

  const reviewBody = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Sayori: Here is your lovely review my dear',
    data:  reviewBody,
  });
});
exports.deleteReview = functionFactory.deleteReqData(Review);
exports.updateReview = functionFactory.updateReqData(Review);
const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchError');
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();

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

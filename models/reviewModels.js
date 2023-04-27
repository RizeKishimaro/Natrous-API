const mongoose = require('mongoose');
const validator = require('validator');
const Tour = require('./tourModels');
const Users = require('./userModels');
const reviewModel = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'You need a Review Text'],
    },
    rating: {
      type: Number,
      required: [true, 'You need a Rating Number'],
      min: 1,
      max: 5,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tours: {
      type: mongoose.Schema.ObjectId,
      ref: Tour,
      required: [true, 'Review must be refer to a tour'],
    },
    users: {
      type: mongoose.Schema.ObjectId,
      ref: Users,
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewModel.statics.averageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tours: tourId },
    },
    {
      $group: {
        _id: '$tours',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats)
  await Tour.findByIdAndUpdate(tourId,{
    ratingsQunatity: stats[0].nRating ,
    ratingsAverage: stats[0].avgRating

  })
};
reviewModel.post('save', function () {
  this.constructor.averageRating(this.tours)
});
reviewModel.pre(/^find/, function (next) {
  this.populate({
    path: 'users',
    select: 'name photo',
  });
  next();
});
const Review = mongoose.model('Review', reviewModel);
module.exports = Review;

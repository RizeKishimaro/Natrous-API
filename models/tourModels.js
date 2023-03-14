const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'THE TOUR NAME MUST INSERT'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration need a number.'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Max of people is needed.'],
  },
  ratingsAverage: {
    type: Number,
    default: 1.5,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Need summary.'],
  },
  ratingsQunatity: {
    type: Number,
    default: 0,
  },
  difficulty: {
    type: String,
    required: [true, 'difficulity is required'],
  },
  price: {
    type: Number,
    required: [true, 'YOU MUST SET THE PRICE!'],
  },
  discount: {
    type: Number,
  },
  imageCover: {
    type: String,
    required: [true, 'image link is required'],
  },
  images: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: {
    type: [Date],
  },
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

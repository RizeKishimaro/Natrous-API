const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'THE TOUR NAME MUST INSERT'],
      unique: true,
      maxLength: [40, 'A tour must have 40 character or lower.'],
      minLength: [10, 'A tour must have at least 10 character.']
      // validate: [validator.isAlpha, "You should not use number and special characters"]
    },
    slug: String,
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
      min: [1, 'rating must be 1.0 or above'],
      max: [5, ' rating must be 5.0 or lower'],
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
      enum: {
        values: ["easy","medium","hard"],
        message: "Difficulity must be either: easy, medium, hard"
      }
    },
    price: {
      type: Number,
      required: [true, 'YOU MUST SET THE PRICE!'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function(value){
          return value < this.price;
        },
        message: "The discount price ({VALUE}) must be lower then Tour price."
      }
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
    secret: {
      type: Boolean,
      default: false,
    },
    startDates: {
      type: [Date],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`It took ${Date.now() - this.start} milliseconds`);
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

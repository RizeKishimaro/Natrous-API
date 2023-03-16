const mongoose = require('mongoose');
const slugify = require("slugify")
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'THE TOUR NAME MUST INSERT'],
    unique: true,
  },
  slug: String
  ,
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
  secret:{
    type: Boolean,
    default: false
  }
  ,
  startDates: {
    type: [Date],
  },
},{
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
tourSchema.pre("save",function(next){
  this.slug = slugify(this.name,{ lower : true})
  next();
})
tourSchema.post("save",function(doc,next){
  console.log(doc)
  next();
});
tourSchema.pre(/^find/,function(next){
  this.find({secret: {$ne: true}});
  next();
})
tourSchema.virtual("durationWeeks").get(function(){
  return this.duration / 7 
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

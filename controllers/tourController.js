const Tour = require('../models/tourModels');
const fs = require('fs');
const catchAsync = require('../utils/catchError');
const AppErrors = require('../utils/appErrors');
const functionFactory = require('./functionFactory');
exports.checkParams = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    console.log(req.body);
    return res.status(403).json({
      status: 'fail',
      message: "You're name and password shouldn't be empty!",
    });
  }
  console.log('middleware works!');
  next();
};

exports.getTours = functionFactory.getAllData(Tour);
exports.postTour = functionFactory.createReqData(Tour);
exports.deleteTour = functionFactory.deleteReqData(Tour);

exports.updateTours = functionFactory.updateReqData(Tour);
exports.getRouteById = functionFactory.getTourById(Tour, { path: 'reviews' });
exports.addData = (req, res) => {
  fs.readFile(
    `${__dirname}/../dev-data/data/tours.json`,
    'utf-8',
    (err, data) => {
      const jsonData = JSON.parse(data);
      Tour.create(jsonData)
        .then((data) =>
          res.status(202).json({
            status: 'success',
            message: 'data successfully inserted',
            data: data,
          })
        )
        .catch((error) => {
          res.status(400).json({
            status: 'failed',
            message: 'the data you requesting to insert is already exist',
            reason: error,
          });
        });
    }
  );
};
exports.deleteData = catchAsync(async (req, res, next) => {
  await Tour.deleteMany();
  console.log('data deleted');
  res.status(202).json({
    status: 'success',
    message: 'Data deleted',
  });
});
exports.getToursStatus = catchAsync(async (req, res, next) => {
  const status = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        numResult: { $sum: 1 },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { minPrice: -1 },
    },
  ]);
  console.log(status);
  res.status(200).json({
    status: 'success',
    data: {
      status,
    },
  });
});
exports.adminLogin = (req, res) => {};
exports.monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-1-1`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        sumStartTours: { $sum: 1 },
        toursName: { $push: '$name' },
      },
    },
    {
      $addFields: { months: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { sumStartTours: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan,
    },
  });
});

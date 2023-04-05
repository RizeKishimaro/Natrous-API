const Tour = require('../models/tourModels');
const fs = require("fs");
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchError');
const AppErrors = require('../utils/appErrors');
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

exports.getTours = catchAsync(async (req, res, next) => {
  // Create a base query to find all tours
  // Execute the query and send the results as a JSON response
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const results = await features.query;
  res.status(200).json({
    status: 'success',
    result: results.length,
    data: results,
  });
});

exports.postTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  if (newTour.length === 0) {
    return res.status(400).json({
      status: 'failed',
      message: 'The Document You Requested Was No Longer Existed!',
    });
  }
  res.status(201).json({
    status: 'success',
    data: newTour,
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppErrors('The requested ID is Not Valid', 404));
  }
  res.status(204).json({
    status: "Sayori: success"
  })
});

exports.updateTours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const tour = await Tour.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppErrors('The ID you provided is not Valid', 404));
  }
  res.status(201).json({
    status: 'success',
    result: tour.length,
    requestTime: new Date().toISOString,
    data: {
      tour: tour,
    },
  });
});
exports.getRouteById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findById(id).populate("reviews")
  if (!tour) {
    return next(new AppErrors('The Id was not valid or does not exist', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
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
            reason: error
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

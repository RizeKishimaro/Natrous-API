const fs = require('fs');
const Tour = require('../models/tourModels');
const ApiFeatures = require('../utils/apiFeatures');
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

exports.getTours = async (req, res) => {
  try {
    // let { sort, select, fields, page, limit } = req.query;

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'failed',
      message: 'The Server Return An `500 Error` message.',
      error: error,
    });
  }
};

exports.postTour = async (req, res) => {
  const newTour = await Tour.create(req.body);
  if (newTour.length === 0) {
    return res.status(400).json({
      status: 'failed',
      message: 'The Document You Requested Was No Longer Existed!',
    });
  }
  try {
    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Error On Saving The Data!',
    });
  }
};
exports.deleteTour = (req, res) => {
  Tour.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      const message = err.message;
      return res.status(500).json({
        status: 'error',
        message: `The data You Requested Is no longer existed.${message.replaceAll(
          '"',
          "'"
        )}`,
      });
    } else if (!doc) {
      return res.status(400).json({
        status: 'error',
        message: 'The data You Requested Is no longer existed.',
      });
    }
    res.status(201).json({
      status: 'success',
      requestTime: new Date().toISOString,
      message: 'The Document You requested Was Now Deleted.',
      data: {
        data: doc,
      },
    });
  });
};

exports.updateTours = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      result: tour.lenght,
      requestTime: new Date().toISOString,
      data: {
        tour: tour,
      },
    });
  } catch (error) {}
};
exports.getRouteById = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(400).json({
        status: 'failed',
        message: 'The Document You Requested Was No Longer Existed!',
      });
    }
    try {
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'failed',
        message: 'Error no data found in this parameter or removed!',
      });
    }
  } catch (error) {
    res.status(400).json({ status: 'failed', message: 'query invalid' });
  }
};
exports.addData = (req, res) => {
  fs.readFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
          });
        });
    }
  );
};
exports.deleteData = async (req, res) => {
  try {
    await Tour.deleteMany();
    console.log('data deleted');
    res.status(202).json({
      status: 'success',
      message: 'Data deleted',
    });
  } catch (error) {
    res.status(409).json({
      status: 'failed',
      message: "The requested data can't be found or delete",
    });
  }
};
exports.getToursStatus = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'failed',
      message: 'The server returned `400 Bad Request`.',
    });
  }
};
exports.adminLogin = (req, res) => {
  
};
exports.monthlyPlan = async (req, res) => {
  try {
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
        $project : {
          _id: 0
        }
      },
      {
        $sort : { sumStartTours: -1}
      }
    ]);
    res.status(200).json({
      status: 'success',
      result: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'failed',
      message: 'The server returned `400 Bad Request`.',
    });
  }
};

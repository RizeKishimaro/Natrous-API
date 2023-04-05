const catchAsync = require('./../utils/catchError');
const AppErrors = require("./../utils/appErrors");
exports.deleteReqData = Model => catchAsync(async (req, res, next) => {
  const tour = await Model.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppErrors('The requested document is deleted or not exist in database', 404));
  }
  res.status(204).json({
    status: 'Sayori: success',
  });
});
exports.updateReqData = Model =>catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const tour = await Model.findByIdAndUpdate(id, data, {
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

  exports.createReqData = Model => catchAsync(async (req, res, next) => {
    const newTour = await Model.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  });
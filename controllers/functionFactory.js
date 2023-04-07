const catchAsync = require('./../utils/catchError');
const AppErrors = require('./../utils/appErrors');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteReqData = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.findByIdAndDelete(req.params.id);
    if (!docs) {
      return next(
        new AppErrors(
          'The requested document is deleted or not exist in database',
          404
        )
      );
    }
    res.status(204).json({
      status: 'Sayori: success',
    });
  });
exports.updateReqData = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const docs = await Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!docs) {
      return next(new AppErrors('The ID you provided is not Valid', 404));
    }
    res.status(201).json({
      status: 'success',
      result: docs.length,
      requestTime: new Date().toISOString,
      data: {
        docs: docs,
      },
    });
  });
exports.getTourById = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const query = Model.findById(id);
    if (popOptions) query.populate(popOptions);
    const docs = await query;
    if (!docs) {
      return next(new AppErrors('The Id was not valid or does not exist', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        docs,
      },
    });
  });
exports.createReqData = (Model) =>
  catchAsync(async (req, res, next) => {
    const newTour = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { newTour },
    });
  });
exports.checkParamsInReq = (req, res, next) => {
  console.log(req.body.docs)
  if (!req.body.docs) req.body.docs = req.params.docsId;
  if (!req.body.users) req.body.users = req.user.id;
  next();
};
exports.getAllData = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Create a base query to find all tours
    // Execute the query and send the results as a JSON response
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const results = await features.query;
    res.status(200).json({
      status: 'success',
      result: results.length,
      data: { results },
    });
  });
exports.getMe = (req,res,next)=>{
  req.params.id = req.user.id
  next();
}
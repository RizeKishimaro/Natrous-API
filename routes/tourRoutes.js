const express = require('express');
const tourControllers = require('../controllers/tourController');
const tourRouters = express.Router();

// tourRouters.param("id",tourControllers.paramsController);
tourRouters.route('/get-promotion').get(tourControllers.getToursStatus);
tourRouters.route('/monthly-plans/:year').get(tourControllers.monthlyPlan);
tourRouters
  .route('/')
  .get(tourControllers.getTours)
  .post(tourControllers.checkParams, tourControllers.postTour)
  .put(tourControllers.addData)
  .delete(tourControllers.deleteData);

tourRouters
  .route('/:id')
  .get(tourControllers.getRouteById)
  .patch(tourControllers.updateTours)
  .delete(tourControllers.deleteTour);
module.exports = tourRouters;


const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const express = require('express');
const app = express();
const tourRouters = require('./routes/tourRoutes');
const userRouters = require('./routes/userRoutes');
const adminRouters = require('./routes/adminRoutes');
const errorControllers = require('./controllers/errorControllers');
const AppErrors = require('./utils/appErrors');
app.use(morgan('dev'));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Monika: Stowp!I'm Begging you please Don't destroy Me Please?",
});
app.use("/api",limiter);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log("I'M MIDDLEWARE!");
  req.requestTime = new Date().toISOString();
  next();
});

///CONTROLLERS

//TOURS ROUTES....

///USERS ROUTES

///ROUTERS

app.use('/api/v1/users', userRouters);
app.use('/api/v1/tours', tourRouters);
app.use('/admin', adminRouters);
app.use(errorControllers);
app.all('*', (req, res, next) => {
  // const err = new Error(`The route you're looking for ${req.originalUrl} is not Exist yet`);
  // err.status = "failed"
  // err.statusCode = 404
  next(
    new AppErrors(
      `The route you're looking for ${req.originalUrl} is not Exist yet`,
      404
    )
  );
});
///ROUTES

module.exports = app;

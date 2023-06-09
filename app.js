const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const express = require('express');
const app = express();
const tourRouters = require('./routes/tourRoutes');
const userRouters = require('./routes/userRoutes');
const adminRouters = require('./routes/adminRoutes');
const chatRouters = require('./routes/chatRouters');
const errorControllers = require('./controllers/errorControllers');
const reviewRouters = require('./routes/reviewRouts');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppErrors = require('./utils/appErrors');
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(morgan('dev'));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Monika: Stowp!I'm Begging you please Don't destroy Me Please?",
});
app.use('/api', limiter);
app.use(express.json({ limit: '500kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
      'ratingQunatity',
      'ratingAverage',
    ],
  })
);
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
app.use('/api/v1/reviews', reviewRouters);
app.use('/admin', adminRouters);
app.use('/api/v1/chat', chatRouters);
app.use(errorControllers);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "The route you looking for is Not Found!"
  })
});
///ROUTES

module.exports = app;

const AppErrors = require('./../utils/appErrors');

////handle errors controllers
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.value}: ${err.path}`;
  return new AppErrors(message, 400);
};

const handleDuplicateKeysDb = (err) => {
  const value = err.keyValue.name;
  const message = `The Keys : ${value} is exist!Please use another name`;
  return new AppErrors(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Data Inserted : ${errors.join('. ')}`;
  return new AppErrors(message, 400);
};

const handleJWTError = (err) =>{
  const message = "invalid token!You must login again!"
  return new AppErrors(message,401)
}

const handleTokenExpireError = (err) =>{
  return new AppErrors("Your Token is expired!Please login again",401)
}
//development error set
const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.name,
    err: err,
    reason: err.stack.split('\n')[0],
    message: 'There has an error in server!',
  });
};

////production error set
const sendErrorProd = (err, res) => {
  if (err.optionalError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('error', err);
    res.status(500).json({
      status: 'error',
      message: "Sorry!We have encountered Some Errors!We'll be right back.",
    });
  }
};

//main GLOBAL ERROR HANDLER
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error!Server returned An `' + err.statusCode;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateKeysDb(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if(error.name === "JsonWebTokenError"){
      error = handleJWTError(error)
    }
    if(error.name === "TokenExpiredError"){
      error = handleTokenExpireError(error)
    }
    sendErrorProd(error, res);
  }
};

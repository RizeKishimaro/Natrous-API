class AppErrors extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.optionalError = true;
    console.log('app error works');

    const error = Error.captureStackTrace(this, this.constructor);
    console.log(error);
  }
}

module.exports = AppErrors;

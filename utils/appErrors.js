class AppErrors extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.optionalError = true;
    console.log('app error works');

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppErrors;

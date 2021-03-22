class ErrorHandler extends Error {
  constructor(error, statusCode) {
    super(error);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;

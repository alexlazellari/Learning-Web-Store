module.exports = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === "SequelizeUniqueConstraintError") {
    error.message = `Validation Error: ${error.errors[0].path} should be unique`;
  }

  res.status(statusCode).json({
    success: false,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

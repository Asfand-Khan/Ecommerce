const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // wrong mongodb ID error handling
  if (err.name === "CastError") {
    const message = `Resource not found, Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === "E11000") {
    const message = `duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

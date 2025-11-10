const logger = require("../utils/logger");

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error occurred: ${err.message}`);
  logger.error(`Stack trace: ${err.stack}`);
  logger.error(`Request URL: ${req.url}`);
  logger.error(`Request method: ${req.method}`);
  logger.error(`Request IP: ${req.ip}`);

  // Determine error type and set appropriate status code
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.http(`${req.method} ${req.url} - IP: ${req.ip}`);

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger,
};

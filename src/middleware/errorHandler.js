/**
 * Global error handling middleware
 */
const logger = require('../utils/logger');
const { ValidationError, ApiError } = require('../utils/errors');

/**
 * Central error handler for the application
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });
  
  // Handle different types of errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      errorType: 'VALIDATION_ERROR'
    });
  }
  
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errorType: 'API_ERROR',
      details: err.details
    });
  }
  
  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    errorType: 'SERVER_ERROR'
  });
};

module.exports = errorHandler;
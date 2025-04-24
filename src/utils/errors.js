/**
 * Custom error classes for the application
 */

/**
 * Validation error for invalid input
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * API error for GHL API failures
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = {
  ValidationError,
  ApiError
};
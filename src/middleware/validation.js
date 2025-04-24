/**
 * Middleware for request validation
 */
const { ValidationError } = require('../utils/errors');

/**
 * Validate request using provided schema
 * @param {Object} schema - Joi schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    // For GET requests, validate query parameters
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new ValidationError(errorMessage));
    }
    
    next();
  };
};

module.exports = validate;
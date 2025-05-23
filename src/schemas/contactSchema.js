/**
 * Validation schemas for contact-related operations
 */
const Joi = require('joi');

// Schema for validating contact request parameters
const contactSchema = Joi.object({
  // Client name must be a string with at least 2 characters
  clientName: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.base': 'Client name must be a string',
      'string.empty': 'Client name cannot be empty',
      'string.min': 'Client name must have at least {#limit} characters',
      'any.required': 'Client name is required'
    }),
  
  // Phone number with optional '+' prefix
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.base': 'Phone number must be a string',
      'string.empty': 'Phone number cannot be empty',
      'string.pattern.base': 'Phone number must be digits (with optional leading +)',
      'any.required': 'Phone number is required'
    }),

  // Optional tag parameter
  tag: Joi.string()
    .min(1)
    .optional()
    .messages({
      'string.base': 'Tag must be a string',
      'string.empty': 'Tag cannot be empty'
    })
}).unknown(false); // Don't allow unknown parameters

module.exports = {
  contactSchema
};

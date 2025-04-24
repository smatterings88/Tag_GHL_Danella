/**
 * Middleware for logging HTTP requests
 */
const logger = require('../utils/logger');

/**
 * Log incoming HTTP requests
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  logger.info(`${req.method} ${req.originalUrl}`, {
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    ip: req.ip
  });
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = requestLogger;
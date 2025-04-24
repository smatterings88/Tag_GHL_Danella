/**
 * Configuration module for the application
 * Loads environment variables and provides configuration values
 */
require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // GoHighLevel API configuration
  ghl: {
    apiKey: process.env.GHL_API_KEY,
    locationId: process.env.GHL_LOCATION_ID,
    baseUrl: process.env.GHL_BASE_URL || 'https://rest.gohighlevel.com/v1'
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

// Validate required environment variables
const requiredEnvVars = ['GHL_API_KEY', 'GHL_LOCATION_ID'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set them in your .env file or environment');
  process.exit(1);
}

module.exports = config;
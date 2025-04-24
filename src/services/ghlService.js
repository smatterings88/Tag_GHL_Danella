/**
 * Service for interacting with the GoHighLevel API
 */
const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/errors');

// Create axios instance with default config
const ghlApi = axios.create({
  baseURL: config.ghl.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.ghl.apiKey}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Search for a contact by phone number
 * @param {string} phoneNumber - Phone number in E.164 format
 * @returns {Promise<Object|null>} - Contact object or null if not found
 */
const searchContactByPhone = async (phoneNumber) => {
  try {
    logger.debug(`Searching for contact with phone: ${phoneNumber}`);
    
    // Format query parameter for GHL API
    const formattedPhone = encodeURIComponent(phoneNumber);
    
    const response = await ghlApi.get(`/contacts/lookup?phone=${formattedPhone}&locationId=${config.ghl.locationId}`);
    
    // Check if contact was found
    if (response.data && response.data.contact) {
      logger.info(`Found contact with phone number: ${phoneNumber}`);
      return response.data.contact;
    }
    
    logger.info(`No contact found with phone number: ${phoneNumber}`);
    return null;
  } catch (error) {
    logger.error('Error searching for contact:', error.response?.data || error.message);
    throw new ApiError(
      'Failed to search for contact',
      error.response?.status || 500,
      error.response?.data || error.message
    );
  }
};

/**
 * Create a new contact in GHL
 * @param {Object} contactData - Contact data
 * @returns {Promise<Object>} - Created contact
 */
const createContact = async (contactData) => {
  try {
    logger.debug(`Creating new contact: ${JSON.stringify(contactData)}`);
    
    // Prepare contact data for GHL API
    const payload = {
      email: contactData.email || '',
      phone: contactData.phone,
      firstName: contactData.name.split(' ')[0] || '',
      lastName: contactData.name.split(' ').slice(1).join(' ') || '',
      locationId: config.ghl.locationId
    };
    
    const response = await ghlApi.post('/contacts', payload);
    
    if (!response.data || !response.data.contact) {
      throw new ApiError('Failed to create contact', 500);
    }
    
    logger.info(`Contact created with ID: ${response.data.contact.id}`);
    return response.data.contact;
  } catch (error) {
    logger.error('Error creating contact:', error.response?.data || error.message);
    throw new ApiError(
      'Failed to create contact',
      error.response?.status || 500,
      error.response?.data || error.message
    );
  }
};

/**
 * Add a tag to a contact
 * @param {string} contactId - Contact ID
 * @param {string} tag - Tag name
 * @returns {Promise<Object>} - Updated contact
 */
const addTagToContact = async (contactId, tag) => {
  try {
    logger.debug(`Adding tag "${tag}" to contact: ${contactId}`);
    
    const response = await ghlApi.post(`/contacts/${contactId}/tags`, {
      tags: [tag],
      locationId: config.ghl.locationId
    });
    
    if (!response.data || response.data.error) {
      throw new ApiError('Failed to add tag to contact', 500);
    }
    
    logger.info(`Tag "${tag}" added to contact: ${contactId}`);
    return response.data;
  } catch (error) {
    logger.error('Error adding tag to contact:', error.response?.data || error.message);
    throw new ApiError(
      'Failed to add tag to contact',
      error.response?.status || 500,
      error.response?.data || error.message
    );
  }
};

module.exports = {
  searchContactByPhone,
  createContact,
  addTagToContact
};

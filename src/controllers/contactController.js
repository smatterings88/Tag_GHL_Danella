/**
 * Controller for contact management operations
 */
const ghlService = require('../services/ghlService');
const logger = require('../utils/logger');
const { ValidationError, ApiError } = require('../utils/errors');

/**
 * Manage a contact - search for existing or create new with VIP tag
 */
const manageContact = async (req, res, next) => {
  try {
    const { clientName, phoneNumber } = req.query;
    
    // Add '+' prefix to phone number
    const formattedPhoneNumber = `+${phoneNumber}`;
    
    logger.info(`Processing contact request for: ${clientName} with phone: ${formattedPhoneNumber}`);
    
    // Search for existing contact
    let existingContact;
    try {
      existingContact = await ghlService.searchContactByPhone(formattedPhoneNumber);
    } catch (err) {
      // Handle GHL's phone validation error (422) as "contact not found"
      if (err instanceof ApiError && err.statusCode === 422) {
        logger.warn(`GHL lookup invalidated phone ${formattedPhoneNumber}, proceeding to create new contact.`);
        existingContact = null;
      } else {
        throw err;
      }
    }
    
    if (existingContact) {
      logger.info(`Contact found with ID: ${existingContact.id}`);
      
      // Add VIP tag to existing contact
      await ghlService.addTagToContact(existingContact.id, "events -> ve0525vip-flash-link-request");
      
      return res.status(200).json({
        status: 'success',
        message: 'Contact found and tagged as VIP',
        data: {
          contact: existingContact,
          isNewContact: false
        }
      });
    }
    
    // Create new contact if none exists
    logger.info(`No contact found. Creating new contact for: ${clientName}`);
    
    const newContact = await ghlService.createContact({
      name: clientName,
      phone: formattedPhoneNumber
    });
    
    // Add VIP tag to new contact
    await ghlService.addTagToContact(newContact.id, "events -> ve0525vip-flash-link-request");
    
    return res.status(201).json({
      status: 'success',
      message: 'New contact created and tagged as VIP',
      data: {
        contact: newContact,
        isNewContact: true
      }
    });
  } catch (error) {
    logger.error('Error in manageContact:', error);
    next(error);
  }
};

module.exports = {
  manageContact
};

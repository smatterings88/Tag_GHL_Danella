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
    const { clientName, phoneNumber, tag = 'events -> ve0525vip-flash-link-request' } = req.query;
    
    // Strip any leading '+' then re-add it exactly once
    const rawDigits = phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber;
    const formattedPhoneNumber = `+${rawDigits}`;
    
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
      
      // Add tag to existing contact
      await ghlService.addTagToContact(existingContact.id, tag);
      
      return res.status(200).json({
        status: 'success',
        message: 'Contact found and tagged',
        data: {
          contact: existingContact,
          isNewContact: false,
          appliedTag: tag
        }
      });
    }
    
    // Create new contact if none exists
    logger.info(`No contact found. Creating new contact for: ${clientName}`);
    
    const newContact = await ghlService.createContact({
      name: clientName,
      phone: formattedPhoneNumber
    });
    
    // Add tag to new contact
    await ghlService.addTagToContact(newContact.id, tag);
    
    return res.status(201).json({
      status: 'success',
      message: 'New contact created and tagged',
      data: {
        contact: newContact,
        isNewContact: true,
        appliedTag: tag
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

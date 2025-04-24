/**
 * Controller for contact management operations
 */
const ghlService = require('../services/ghlService');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errors');

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
    const existingContact = await ghlService.searchContactByPhone(formattedPhoneNumber);
    
    if (existingContact) {
      logger.info(`Contact found with ID: ${existingContact.id}`);
      
      // Add VIP tag to existing contact
      await ghlService.addTagToContact(existingContact.id, "opted for VIP");
      
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
    await ghlService.addTagToContact(newContact.id, "opted for VIP");
    
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
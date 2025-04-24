/**
 * Routes for contact management
 */
const express = require('express');
const contactController = require('../controllers/contactController');
const validate = require('../middleware/validation');
const { contactSchema } = require('../schemas/contactSchema');

const router = express.Router();

/**
 * @route GET /api/contacts
 * @desc Search for contact by phone number or create new contact
 * @access Public
 */
router.get('/', validate(contactSchema), contactController.manageContact);

module.exports = router;
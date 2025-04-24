/**
 * Main router for the application
 */
const express = require('express');
const contactsRouter = require('./contacts');

const router = express.Router();

// Register routes
router.use('/contacts', contactsRouter);

module.exports = router;
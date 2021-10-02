var express = require('express');
var router = express.Router();

// Initialize express router
router = require('express').Router();

// Import mail controller
var mailController = require('../controller/mailController');

// mail routes
router.route('/')
.post(mailController.send)

module.exports = router;

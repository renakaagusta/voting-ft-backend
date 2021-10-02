var express = require('express');
var router = express.Router();

// Initialize express router
router = require('express').Router();

// Import main controller
var mainController = require('../controller/mainController');

// main routes
router.route('/login')
.post(mainController.login)

router.route('/announcement')
.get(mainController.announcement)

router.route('/outline')
.get(mainController.outline)

module.exports = router;

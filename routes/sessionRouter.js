var express = require('express');
var router = express.Router();

// Initialize express router
router = require('express').Router();

// Import session controller
var sessionController = require('../controller/sessionController');

// session routes
router.route('/')
.post(sessionController.new)

router.route('/all')
.get(sessionController.index)

router.route('/:id')
.get(sessionController.view)
.put(sessionController.update)
.delete(sessionController.delete);

module.exports = router;

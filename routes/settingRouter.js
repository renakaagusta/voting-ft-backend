var express = require('express');
var router = express.Router();

// Initialize express router
router = require('express').Router();

// Import setting controller
var settingController = require('../controller/settingController');

// setting routes
router.route('/')
.post(settingController.new)

router.route('/all')
.get(settingController.index)

router.route('/upload-procedure')
.put(settingController.upload)

router.route('/:id')
.get(settingController.view)
.put(settingController.update)
.delete(settingController.delete);

module.exports = router;

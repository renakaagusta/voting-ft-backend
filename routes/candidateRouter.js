var express = require('express');
var router = express.Router();

// Initialize express router
router = require('express').Router();

// Import candidate controller
var candidateController = require('../controller/candidateController');

// candidate routes
router.route('/')
.post(candidateController.new)

router.route('/all')
.get(candidateController.index)

router.route('/count')
.put(candidateController.count);

router.route('/:id/upload')
.put(candidateController.upload)

router.route('/:id')
.get(candidateController.view)
.put(candidateController.update)
.delete(candidateController.delete);

module.exports = router;

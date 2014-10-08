'use strict';

var express = require('express');
var alchemy = require('./alchemy.controller');
var AlchemyAPI = require('alchemy-api');

var router = express.Router();

router.post('/', alchemy.sentiment);
router.post('/keywords', alchemy.keywords);
router.post('/concepts', alchemy.concepts);

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
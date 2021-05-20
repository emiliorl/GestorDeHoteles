'use strict'

var express = require('express');
var receiptController = require('../controllers/receipt.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/receipt', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel],receiptController.saveReceipt);

module.exports = api;
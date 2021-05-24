'use strict'

var express = require('express');
var serviceController = require('../controllers/service.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/createService/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], serviceController.createService);
api.post('/deleteService/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], serviceController.deleteService);
api.get('/listService', serviceController.listService);
api.post('/getService', serviceController.getService);

module.exports = api;
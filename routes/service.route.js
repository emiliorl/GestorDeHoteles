'use strict'

var express = require('express');
var serviceController = require('../controllers/service.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createService/:hid', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], serviceController.createService);
api.post('/:id/deleteService/:hid/:idS', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], serviceController.deleteService);//YA
api.put('/:id/updateService/:hid/:idS', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], serviceController.updateService);//YA
api.get('/:hid/listService', serviceController.listService);//YA
api.post('/:hid/getService', serviceController.getService);

module.exports = api;
'use strict'

var express = require('express');
var eventController = require('../controllers/event.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createEvent/:hid', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], eventController.createEvent);
api.post('/:id/deleteEvent/:hid/:idE', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], eventController.deleteEvent);
api.post('/:id/updateEvent/:hid/:idE', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], eventController.updateEvent);
api.get('/:hid/listEvent', eventController.listEvent);
api.post('/:hid/getEvent', eventController.getEvent);

module.exports = api;
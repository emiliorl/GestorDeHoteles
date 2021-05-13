'use strict'

var express = require('express');
var eventController = require('../controllers/event.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/createEvent/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], eventController.createEvent);
api.post('/deleteEvent/:idE', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], eventController.deleteEvent);
api.post('/updateEvent/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], eventController.updateEvent);
api.get('/listEvent', eventController.listEvent);
api.post('/getEvent', eventController.getEvent);

module.exports = api;
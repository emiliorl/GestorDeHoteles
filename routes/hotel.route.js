'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/createHotel/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], hotelController.createHotel);
api.get('/listHotel', hotelController.listHotel);
api.post('/getHotel', hotelController.getHotel);

module.exports = api;
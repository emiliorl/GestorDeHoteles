'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createHotel', [mdAuth.ensureAuth, mdAuth.validRolAdmin], hotelController.createHotel);
api.put('/:id/updateHotel/:idH', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], hotelController.updateHotel);
api.post('/:id/deleteHotel/:idH', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], hotelController.deleteHotel);
api.get('/listHotels', hotelController.listHotels);
api.post('/getHotel', hotelController.getHotel);
api.get('/getHotelsAdmin/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], hotelController.getHotelsAdmin);

module.exports = api;
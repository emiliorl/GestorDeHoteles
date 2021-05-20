'use strict'

var express = require('express');
var roomController = require('../controllers/room.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.put('/SetRoom', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.setRoom);
api.put('/updateRoom', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.updateRoom);
api.put('/removeRoom', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.removeRoom);


module.exports = api;

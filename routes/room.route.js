'use strict'

var express = require('express');
var roomController = require('../controllers/room.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createRoom/:hid', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.setRoom);
api.post('/:id/updateRoom/:hid/:idR', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.updateRoom);
api.put('/:id/removeRoom/:hid/:idR', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.removeRoom);
api.put('/:hid/listRooms', roomController.listRoom);

module.exports = api;

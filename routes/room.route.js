'use strict'

var express = require('express');
var roomController = require('../controllers/room.controller');
<<<<<<< HEAD

var api = express.Router();

api.get('/prueba', roomController.prueba);
api.put('/SetRoom', roomController.setRoom);
api.put('/updateRoom', roomController.updateRoom);
api.put('/removeRoom', roomController.removeRoom);

=======
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createRoom/:hid', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.setRoom);
api.post('/:id/updateRoom/:hid/:idR', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.updateRoom);
api.put('/:id/removeRoom/:hid/:idR', [mdAuth.ensureAuth, mdAuth.validRolAdminHotel], roomController.removeRoom);
api.put('/:hid/listRooms', roomController.listRoom);
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22

module.exports = api;

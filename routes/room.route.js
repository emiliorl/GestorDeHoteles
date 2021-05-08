'use strict'

var express = require('express');
var roomController = require('../controllers/room.controller');

var api = express.Router();

api.get('/prueba', roomController.prueba);
api.put('/SetRoom', roomController.setRoom);
api.put('/updateRoom', roomController.updateRoom);
api.put('/removeRoom', roomController.removeRoom);


module.exports = api;

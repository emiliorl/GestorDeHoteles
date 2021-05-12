'use strict'

var express = require('express');
var reservationController = require('../controllers/reservation.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.get('/listReservation', reservationController.listReservation);
api.get('/listReservationDisp', reservationController.listReservationDisp);
api.get('/listReservationNoDisp', reservationController.listReservationNoDisp);
api.post('/removeReservation/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], reservationController.removeReservation);
api.get('/findReservationBynameUser/:id', reservationController.findReservationBynameUser);

module.exports = api;
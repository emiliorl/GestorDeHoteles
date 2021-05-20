'use strict'

var express = require('express');
var reservationController = require('../controllers/reservation.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/:hid/:rid/makeReservation', mdAuth.ensureAuth, reservationController.createReservation);
api.get('/listReservation', mdAuth.ensureAuth, reservationController.listReservation);
api.post('/:hid/:rid/listReservation', reservationController.checkStatusRoom);
api.get('/listReservationDisp', reservationController.listReservationDisp);
api.get('/listReservationNoDisp', reservationController.listReservationNoDisp);
api.post('/removeReservation/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], reservationController.removeReservation);
api.get('/findReservationBynameUser/:id', reservationController.findReservationBynameUser);

module.exports = api;
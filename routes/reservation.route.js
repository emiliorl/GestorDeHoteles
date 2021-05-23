'use strict'

var express = require('express');
var reservationController = require('../controllers/reservation.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

//rid - Room ID y idR - Reservation ID
api.post('/:id/:hid/:rid/makeReservation', mdAuth.ensureAuth, reservationController.createReservation);
api.post('/:id/:idR/updateReservation', mdAuth.ensureAuth, reservationController.updateReservation);
api.get('/:id/listReservations', mdAuth.ensureAuth, reservationController.listReservation);
api.get('/:hid/listAvailableRooms', reservationController.listAvailableRooms);
api.get('/:id/:hid/listNotAvailableRooms', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], reservationController.listNotAvailableRooms);
api.get('/listReservationNoDisp', reservationController.listReservationNoDisp);
api.post('/:id/:idR/deleteReservation', mdAuth.ensureAuth, reservationController.removeReservation);
api.get('/findReservationBynameUser/:id', reservationController.findReservationBynameUser);

api.post('/:id/:Rid/addService/:idS', mdAuth.ensureAuth, reservationController.addService);
api.post('/:id/:Rid/removeService/:idS', mdAuth.ensureAuth, reservationController.removeService);
api.post('/:id/mostRequestedHotel', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], reservationController.mostRequestHotel);
api.put('/:hid/createPDF', reservationController.createPDF);
api.get('/:id/:idR/receipt', [mdAuth.ensureAuth], reservationController.receipt);
api.get('/:id/:hid/hotelStatistics',[mdAuth.ensureAuth, mdAuth.validRolAdminHotel], reservationController.statisticsByHotel);

module.exports = api;
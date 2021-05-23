'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = Schema({
    checkIn: Date,
    checkOut: Date,
    user: {type: Schema.ObjectId, ref: 'user'},
    room: {type: Schema.ObjectId, ref: 'room'},
    hotel: {type: Schema.ObjectId, ref: "hotel"},
    services: [{type: Schema.ObjectId, ref: 'service'},{quantity: Number}],
});

module.exports = mongoose.model('reservation', reservationSchema);
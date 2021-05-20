'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = Schema({
    checkIn: Date,
    checkOut: Date,
    user: {type: Schema.ObjectId, ref: 'user'},
    room: [{type: Schema.ObjectId, ref: 'room'}],
    serviceBefore: [{type: Schema.ObjectId, ref: 'service'}],
});

module.exports = mongoose.model('reservation', reservationSchema);
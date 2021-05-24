'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = Schema({
    checkIn: Date,
    checkOut: Date,
<<<<<<< HEAD
    user: [{type: Schema.ObjectId, ref: 'user'}],
    room: [{type: Schema.ObjectId, ref: 'room'}],
    serviceBefore: [{type: Schema.ObjectId, ref: 'service'}],
=======
    user: {type: Schema.ObjectId, ref: 'user'},
    room: {type: Schema.ObjectId, ref: 'room'},
    hotel: {type: Schema.ObjectId, ref: "hotel"},
    services: [{type: Schema.ObjectId, ref: 'service'},{quantity: Number}],
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
});

module.exports = mongoose.model('reservation', reservationSchema);
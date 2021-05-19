'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    nameHotel: String,
    country: String,
    state: String,
    city: String,
    zipCode: String,
    address: String,
    phoneHotel: Number,
    description: String,
    imageHotel: String,
    user: {type: Schema.ObjectId, ref: "user"},
    services: [{type: Schema.ObjectId, ref: "service"}]
});

module.exports = mongoose.model('hotel', hotelSchema);
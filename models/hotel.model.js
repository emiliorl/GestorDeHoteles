'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    nameHotel: String, 
    address: String, 
    phoneHotel: Number,
    description: String,
    user: [{type: Schema.ObjectId, ref: "user"}]
});

module.exports = mongoose.model('hotel', hotelSchema);
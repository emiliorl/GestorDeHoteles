'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
<<<<<<< HEAD
    nameHotel: String, 
    address: String, 
    phoneHotel: Number,
    description: String,
    user: [{type: Schema.ObjectId, ref: "user"}]
=======
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
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
});

module.exports = mongoose.model('hotel', hotelSchema);
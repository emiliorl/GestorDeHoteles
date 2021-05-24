'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema({
    nameRoom: String, 
    price: Number,
    description: String,
    status: String,
<<<<<<< HEAD
    hotel: [{type: Schema.ObjectId, ref: "hotel"}]
=======
    imageRoom: [String],
    hotel: {type: Schema.ObjectId, ref: "hotel"}
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
});

module.exports = mongoose.model('room', roomSchema);
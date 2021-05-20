'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema({
    nameRoom: String, 
    price: Number,
    description: String,
    status: String,
    imageRoom: [String],
    hotel: {type: Schema.ObjectId, ref: "hotel"}
});

module.exports = mongoose.model('room', roomSchema);
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    rol: String,
    phone: Number,
    email: String,
    password: String,
    image: {type: String, default: "defaultProfilePicture.png"},
    reservations: [{type: Schema.ObjectId, ref: 'receipt'}]
});

module.exports = mongoose.model('user', userSchema);
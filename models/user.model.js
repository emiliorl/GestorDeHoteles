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
    profilePicture: String,
    receipts: [{type: Schema.ObjectId, ref: 'receipt'}]
});

module.exports = mongoose.model('user', userSchema);
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
<<<<<<< HEAD
    profilePicture: String,
    userHistory: [{type: Schema.ObjectId, ref: 'userHistory'}]
=======
    image: {type: String, default: "defaultProfilePicture.png"},
    reservations: [{type: Schema.ObjectId, ref: 'receipt'}]
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
});

module.exports = mongoose.model('user', userSchema);
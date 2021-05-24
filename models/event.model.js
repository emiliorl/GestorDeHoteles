'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({
    nameEvent: String,
    typeEvent: String,
    description: String,
    date: Date,
<<<<<<< HEAD
    hotel: [{type: Schema.ObjectId, ref: 'hotel'}],
=======
    imageEvent: String,
    hotel: {type: Schema.ObjectId, ref: 'hotel'}
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
});

module.exports = mongoose.model('event', eventSchema);
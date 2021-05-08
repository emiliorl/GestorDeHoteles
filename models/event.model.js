'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({
    nameEvent: String,
    typeEvent: String,
    description: String,
    date: Date,
    hotel: [{type: Schema.ObjectId, ref: 'hotel'}],
});

module.exports = mongoose.model('event', eventSchema);
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var receiptSchema = Schema({
    date: Date,
    serviceAfter: [{type: Schema.ObjectId, ref: 'service'}],
    reservation: {type: Schema.ObjectId, ref: 'reservation'},
    total: Number
});

module.exports = mongoose.model('receipt', receiptSchema);
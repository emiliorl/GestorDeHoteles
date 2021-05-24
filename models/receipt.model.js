'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var receiptSchema = Schema({
    date: Date,
    serviceAfter: [{type: Schema.ObjectId, ref: 'service'}],
<<<<<<< HEAD
    reservation: [{type: Schema.ObjectId, ref: 'reservation'}],
=======
    reservation: {type: Schema.ObjectId, ref: 'reservation'},
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
    total: Number
});

module.exports = mongoose.model('receipt', receiptSchema);
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userHistorySchema = Schema({
    receipt: [{Type: Schema.ObjectId, ref:'receipt'}]
});

module.exports = mongoose.model('userHistory', userHistorySchema);
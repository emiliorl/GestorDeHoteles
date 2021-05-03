'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = Schema({
    nameService: String,
    price: Number
});

module.exports = mongoose.model('service', serviceSchema);
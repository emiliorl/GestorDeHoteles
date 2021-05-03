'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userHistorySchema = Schema({
<<<<<<< HEAD
    
=======
    receipt: [{Type: Schema.ObjectId, ref:'receipt'}]
>>>>>>> Matthew-Reyes
});

module.exports = mongoose.model('userHistory', userHistorySchema);
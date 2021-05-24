'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userHistorySchema = Schema({
<<<<<<< HEAD
<<<<<<< HEAD
    
=======
    receipt: [{Type: Schema.ObjectId, ref:'receipt'}]
>>>>>>> Matthew-Reyes
=======
    receipt: [{Type: Schema.ObjectId, ref:'receipt'}]
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
});

module.exports = mongoose.model('userHistory', userHistorySchema);
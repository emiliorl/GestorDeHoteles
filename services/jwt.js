'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'gestorHoteles-v1@';

exports.createToken = (user) =>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        rol: user.rol,
        iat: moment().unix(),
<<<<<<< HEAD
        exp: moment().add(3600, 'seconds').unix()
=======
        exp: moment().add(5, 'hours').unix()
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
    }
    return jwt.encode(payload, secretKey);
}
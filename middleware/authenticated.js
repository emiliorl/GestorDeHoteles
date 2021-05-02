'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'gestorHoteles-v1@';

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(404).send({message: 'La petición no lleva cabecera de autenticación'});
    }else{
        var token = req.headers.authorization.replace(/['"']+/g,'');

        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message:'El token ah expirado'});
            }
        }catch(err){
            return res.status(401).send({message:'Token invalido'});
        }
        req.user = payload;
        console.log(req.user);
        next();
    }
}

exports.validRolAdmin = (req, res, next) => {
    var payload = req.user;

    if(payload.rol != 'ADMIN'){
        return res.status(401).send({message:'No tienes permiso para utilizar esta función'});
    }else{
        next();
    }
}

exports.validRolAdminHotel = (req, res, next) => {
    var payload = req.user;

    if(payload.rol != 'ADMIN_HOTEL'){
        return res.status(401).send({message:'No tienes permiso para utilizar esta función'});
    }else{
        next();
    }
}
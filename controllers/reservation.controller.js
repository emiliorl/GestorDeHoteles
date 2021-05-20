'use strict'

var Service = require('../models/service.model')
var Room = require('../models/room.model');
var User = require('../models/user.model')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function listReservation(req, res){

    let reservationId = req.params.id;
    if(reservationId != req.room.sub){
        return res.status(404).send({message:'No tienes permiso para hacer esto'});
    }else{
        Reservation.find((err, reservationFind) => {
            if(err){
                return res.status(500).send({message:'Error al listar las reservaciones'});
            }else if(reservationFind){
                return res.send({message:'Estas son las reservaciones:', listReservation: reservationFind});
            }else{
                return res.status(404).send({message:'No se encuentran reservaciones'});
            }
        })
    }
}

function listReservationDisp(req, res){
    let roomId = req.params.idRo;
    let reservationId = req.params.idRe;


    if(roomId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'});
    }else{
        Room.find({_id: roomId, Reservation: reservationId},
            {$pull:{Reservation: reservationId}}, {new:true}, (err, reservationFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(reservationFind){
                    Reservation.find(reservationId, (err, reservationFound)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al encontrar reservaciones'});
                        }else if(reservationFound){
                            if(reservation.status == "Disponible")
                            return res.send({message:'Habitaciones disponibles:', listReservation: reservationFind});
                        }else{
                            return res.status(500).send({message: 'No se encuentran reservaciones'});
                        }
                    })
                }else{
                    return res.status(404).send({message:'No se encuentran habitaciones disponibles'});
                }
            }).populate('reservation')
    }
}


function listReservationNoDisp(req, res){
    let roomId = req.params.idRo;
    let reservationId = req.params.idRe;


    if(roomId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'});
    }else{
        Room.find({_id: roomId, Reservation: reservationId},
            {$pull:{Reservation: reservationId}}, {new:true}, (err, reservationFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(reservationFind){
                    Reservation.find(reservationId, (err, reservationFound)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al encontrar reservaciones'});
                        }else if(reservationFound){
                            if(reservation.status == "No disponible")
                            return res.send({message:'Habitaciones no disponibles:', listReservation: reservationFind});
                        }else{
                            return res.status(500).send({message: 'No se encuentran reservaciones'});
                        }
                    })
                }else{
                    return res.status(404).send({message:'No hay habitaciones reservadas'});
                }
            }).populate('reservation')
    }
}

function removeReservation(req, res){
    let reservationId = req.params.id;
    let params = req.body;

    if(reservationId != req.room.sub){
        return res.status(403).send({message: 'No tienes permiso para hacer esto'});
    }else{
        Reservation.findOne({_id: reservationId}, (err, reservationFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al eliminar'});
            }else if(reservationFind){
                bcrypt.compare(params.password, reservationFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al verificar contraseña'});
                    }else if(checkPassword){
                        Reservation.findByIdAndRemove(reservationId, (err, reservationRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar'});
                            }else if(reservationRemoved){
                                return res.send({message: 'Se ha eliminado la reservación'});
                            }else{
                                return res.status(403).send({message: 'No se eliminó la reservación'});
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'No puedes eliminar reservaciones'});
                    }
                })
            }else{
                return res.status(403).send({message: 'La reservación no fue eliminada'});
            } 
        })
    }
}

function findReservationBynameUser(req, res){
    var params = req.body;

    if(params.search){
        User.find({$or:[{user: params.search}]}, (err, resultSearch)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(resultSearch){
                Reservation.find((err, reservationFind) => {
                    if(err){
                        return res.status(500).send({message:'Error al listar las reservaciones'});
                    }else if(reservationFind){
                        return res.send({message:'Estas son las reservaciones:', findReservationBynameUser: reservationFind});
                    }else{
                        return res.status(404).send({message:'No se encuentran reservaciones'});
                    }
                })
            }else{
                return res.status(403).send({message: 'No hay reservaciones'});
            }
        })
    }else{
        return res.status(403).send({message: 'Ingrese datos en el campo de búsqueda'});
    }
}

module.exports = {
    listReservation,
    listReservationDisp,
    listReservationNoDisp,
    removeReservation,
    findReservationBynameUser
}
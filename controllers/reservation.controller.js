'use strict'

var Service = require('../models/service.model')
var Hotel = require('../models/hotel.model')
var Reservation = require('../models/reservation.model')
var Room = require('../models/room.model');
var User = require('../models/user.model')
var bcrypt = require('bcrypt-nodejs');

function createReservation(req,res){
    var userId = req.params.id;
    var hotelId = req.params.hid;
    var roomId = req.params.rid;
    var params = req.body;
    var reservation = new Reservation();

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para hacer esto'});
    }else{
        Hotel.findById(hotelId).exec((err, hotelFind)=>{
            if(err){
                return res.status(500).send({message:'Error al buscar el hotel'});
            }else if(hotelFind){
                Room.findById(roomId).exec((err, roomFind)=>{
                    if(err){
                        return res.status(500).send({message:'Error al buscar la haitacion'});
                    }else if(roomFind){
                        Reservation.findOne({checkIn: {$gte: params.checkIn}, checkOut: {$lte: params.checkOut}}, (err, reservationFind)=>{
                            if(err){
                                return res.status(500).send({message:'Error al buscar otras reservacion que coincidadn con la fecha'});
                            }else if(reservationFind){
                                console.log(reservationFind)
                                return res.status(404).send({message:'La haitacion no esta diponible'});
                            }else{
                                reservation.checkIn = params.checkIn;
                                reservation.checkOut = params.checkOut;
                                var time = new Date().getTime();
                                var today = new Date(time);
                                if(reservation.checkIn >= today && reservation.checkOut >= today && reservation.checkIn < reservation.checkOut){
                                    reservation.room = roomId;
                                    reservation.user = userId;
    
                                    reservation.save((err, reservationSaved) => {
                                        if(err){
                                            return res.status(400).send({message:'Error general al intentar realizar la reservacion'});
                                        }else if(reservationSaved){
                                            User.findByIdAndUpdate(userId, {$push:{reservations: reservationSaved._id}}, {new: true}, (err, reservationPush)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general al realizar reservacion'})
                                                }else if(reservationPush){
                                                    return res.send({message:'La reservacion se realizo exitosamente', Reservacion: reservationSaved});
                                                }else{
                                                    return res.status(500).send({message: 'Error al realizar la reservacion'})
                                                }
                                            })
                                        }else{
                                            return res.status(400).send({message:'No sea ha podido realizar la reservacion'});
                                        }
                                    })
                                }else{
                                    return res.send({message: 'Fechas no valida'});
                                }
                            }
                        })
                    }else{
                        return res.status(404).send({message:'No se ha encontrado la haitacion'});
                    }
                })
            }else{
                return res.status(404).send({message:'No se ha encontrado el hotel'});
            }
        })
    }
}

function listReservation(req, res){
    let userId = req.params.id;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para hacer esto'});
    }else{
        Reservation.find({user: userId}).exec((err, reservationFind) => {
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

function checkStatusRoom(req,res){
    var userId = req.params.id;
    var hotelId = req.params.hid;
    var roomId = req.params.rid;
    var params = req.body;


    Hotel.findById(hotelId).exec((err, hotelFind)=>{
        if(err){
            return res.status(500).send({message:'Error al buscar el hotel'});
        }else if(hotelFind){
            Room.findOne({_id: roomId, hotel: hotelId}).exec((err, roomFind)=>{
                if(err){
                    return res.status(500).send({message:'Error al buscar la haitacion'});
                }else if(roomFind){
                    Reservation.find({room: roomId}).exec((err, roomFind)=>{
                        if(err){
                            return res.status(500).send({message:'Error al buscar la haitacion'});
                        }else if(roomFind){
                            
                        }else{
                            return res.status(404).send({message:'No se ha encontrado la haitacion'});
                        }
                    })
                }else{
                    return res.status(404).send({message:'No se ha encontrado la haitacion'});
                }
            })
        }else{
            return res.status(404).send({message:'No se ha encontrado el hotel'});
        }
    })
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
    createReservation,
    checkStatusRoom,
    listReservation,
    listReservationDisp,
    listReservationNoDisp,
    removeReservation,
    findReservationBynameUser
}
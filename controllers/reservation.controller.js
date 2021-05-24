'use strict'

var Service = require('../models/service.model')
var Hotel = require('../models/hotel.model')
var Reservation = require('../models/reservation.model')
var Room = require('../models/room.model');
var User = require('../models/user.model')
var bcrypt = require('bcrypt-nodejs');
var fs = require("fs");
const PDFDocument = require('./pdfkit-tables');
const doc = new PDFDocument({layout: 'landscape'});

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
                                return res.status(404).send({message:'La haitacion no esta diponible'});
                            }else{
                                reservation.checkIn = params.checkIn;
                                reservation.checkOut = params.checkOut;
                                var time = new Date().getTime();
                                var today = new Date(time);
                                if(reservation.checkIn >= today && reservation.checkOut >= today && reservation.checkIn < reservation.checkOut){
                                    reservation.room = roomId;
                                    reservation.user = userId;
                                    reservation.hotel = hotelId;
    
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

function updateReservation(req,res){
    var userId = req.params.id;
    var reservationId = req.params.idR;
    var update = req.body;

    if(userId != req.user.sub || update.user || update.hotel){
        return res.status(404).send({message:'No tienes permiso para hacer esto'});
    }else{
        User.findById(userId).exec((err,userFind)=> {
            if(err){
                return res.status(500).send({message:'Error al buscar el usuario'});
            }else if(userFind){
                if(update.room || update.checkIn || update.checkOut){
                    Reservation.findById(reservationId).exec((err, reservationFind)=> {
                        if(err){
                            return res.status(500).send({message:'Error al buscar la reservacion'});
                        }if(!reservationFind){
                            return res.status(404).send({message:'No se encontra la reservacion'});
                        }else if(reservationFind.user == userId){
                            if(update.checkIn && update.checkOut && update.room){
                                Room.find({_id:[update.room,reservationFind.room], hotel: reservationFind.hotel}).exec((err, roomFindU) => {
                                    if(err){
                                        return res.status(500).send({message:'Error general al intentar listar habitaciones'});
                                    }else if(roomFindU.length > 1){
                                        var checkIn = new Date(update.checkIn);
                                        var checkOut = new Date(update.checkOut);
                                        var time = new Date().getTime();
                                        var today = new Date(time);
                                        if(checkIn >= today && checkOut >= today && checkIn < checkOut){
                                            Reservation.findOne({checkIn: {$gte: update.checkIn}, checkOut: {$lte: update.checkOut}, room: update.room, _id: {$ne: reservationFind._id}}, (err, reservationFindMatch)=>{
                                                if(err){
                                                    return res.status(500).send({message:'Error al buscar otras reservacion que coincidadn con la fecha'});
                                                }else if(reservationFindMatch){
                                                    return res.status(404).send({message:'La haitacion no esta diponible'});
                                                }else{
                                                    Reservation.findByIdAndUpdate(reservationId, update, {new: true}, (err, reservationUpdate) => {
                                                        if(err){
                                                            return res.status(500).send({message:'Error al actualizar la reservacion'});
                                                        }else if(reservationUpdate){
                                                            return res.status(200).send({message:'Reservacion actualizada', reservationUpdate});
                                                        }else{
                                                            return res.status(404).send({message:'No se pudo actualizar la reservacion'});
                                                        }
                                                    })
                                                }
                                            })
                                        }else{
                                            return res.send({message: 'Fechas no validas'});
                                        }
                                    }else{
                                        return res.status(404).send({message:'Las haitaciones no coinciden'});
                                    }
                                })
                            }else if(update.checkIn && update.checkOut && !update.room){
                                var checkIn = new Date(update.checkIn);
                                var checkOut = new Date(update.checkOut);
                                var time = new Date().getTime();
                                var today = new Date(time);
                                if(checkIn >= today && checkOut >= today && checkIn < checkOut){
                                    Reservation.findOne({checkIn: {$gte: update.checkIn}, checkOut: {$lte: update.checkOut}, _id: {$ne: reservationFind._id}}, (err, reservationFindMatch)=>{
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar otras reservacion que coincidadn con la fecha'});
                                        }else if(reservationFindMatch){
                                            return res.status(404).send({message:'La haitacion no esta diponible'});
                                        }else{
                                            Reservation.findByIdAndUpdate(reservationId, update, {new: true}, (err, reservationUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al actualizar la reservacion'});
                                                }else if(reservationUpdate){
                                                    return res.status(200).send({message:'Reservacion actualizada', reservationUpdate});
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar la reservacion'});
                                                }
                                            })
                                        }
                                    })
                                }else{
                                    return res.send({message: 'Fechas no validas'});
                                }
                            }else if(update.checkIn && update.room){
                                Room.find({_id:[update.room,reservationFind.room], hotel: reservationFind.hotel}).exec((err, roomFindU) => {
                                    if(err){
                                        return res.status(500).send({message:'Error general al intentar listar habitaciones'});
                                    }else if(roomFindU.length > 1){
                                        var checkIn = new Date(update.checkIn);
                                        var time = new Date().getTime();
                                        var today = new Date(time);
                                        if(checkIn >= today && checkIn < reservationFind.checkOut){
                                            Reservation.findOne({checkIn: {$gte: update.checkIn}, checkOut: {$lte: reservationFind.checkOut}, room: update.room, }, (err, reservationFindMatch)=>{
                                                if(err){
                                                    return res.status(500).send({message:'Error al buscar otras reservacion que coincidadn con la fecha'});
                                                }else if(reservationFindMatch){
                                                    return res.status(404).send({message:'La haitacion no esta diponible'});
                                                }else{
                                                    Reservation.findByIdAndUpdate(reservationId, update, {new: true}, (err, reservationUpdate) => {
                                                        if(err){
                                                            return res.status(500).send({message:'Error al actualizar la reservacion'});
                                                        }else if(reservationUpdate){
                                                            return res.status(200).send({message:'Reservacion actualizada', reservationUpdate});
                                                        }else{
                                                            return res.status(404).send({message:'No se pudo actualizar la reservacion'});
                                                        }
                                                    })
                                                }
                                            })
                                        }else{
                                            return res.send({message: 'Fechas no validas'});
                                        }
                                    }else{
                                        return res.status(404).send({message:'Las haitaciones no coinciden'});
                                    }
                                })
                            }else if(update.checkOut && update.room){
                                Room.find({_id:[update.room,reservationFind.room], hotel: reservationFind.hotel}).exec((err, roomFindU) => {
                                    if(err){
                                        return res.status(500).send({message:'Error general al intentar listar habitaciones'});
                                    }else if(roomFindU.length > 1){
                                        var checkOut = new Date(update.checkOut);
                                        var time = new Date().getTime();
                                        var today = new Date(time);
                                        if(checkOut >= today && checkOut > reservationFind.checkIn){
                                            Reservation.findOne({checkIn: {$gte: reservationFind.checkIn}, checkOut: {$lte: update.checkOut}, room: update.room}, (err, reservationFindMatch)=>{
                                                if(err){
                                                    return res.status(500).send({message:'Error al buscar otras reservacion que coincidadn con la fecha'});
                                                }else if(reservationFindMatch){
                                                    return res.status(404).send({message:'La haitacion no esta diponible'});
                                                }else{
                                                    Reservation.findByIdAndUpdate(reservationId, update, {new: true}, (err, reservationUpdate) => {
                                                        if(err){
                                                            return res.status(500).send({message:'Error al actualizar la reservacion'});
                                                        }else if(reservationUpdate){
                                                            return res.status(200).send({message:'Reservacion actualizada', reservationUpdate});
                                                        }else{
                                                            return res.status(404).send({message:'No se pudo actualizar la reservacion'});
                                                        }
                                                    })
                                                }
                                            })
                                        }else{
                                            return res.send({message: 'Fechas no validas'});
                                        }
                                    }else{
                                        return res.status(404).send({message:'Las haitaciones no coinciden'});
                                    }
                                })
                            }else if(update.checkIn){
                                var checkIn = new Date(update.checkIn);
                                var time = new Date().getTime();
                                var today = new Date(time);
                                if(checkIn >= today && checkIn < reservationFind.checkOut){
                                    Reservation.findOne({checkIn: {$gte: update.checkIn}, checkOut: {$lte: reservationFind.checkOut}, _id: {$ne: reservationFind._id}}, (err, reservationFindMatch)=>{
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar otras reservacion que coincidadn con la fecha'});
                                        }else if(reservationFindMatch){
                                            return res.status(404).send({message:'La haitacion no esta diponible'});
                                        }else{
                                            Reservation.findByIdAndUpdate(reservationId, update, {new: true}, (err, reservationUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al actualizar la reservacion'});
                                                }else if(reservationUpdate){
                                                    return res.status(200).send({message:'Reservacion actualizada', reservationUpdate});
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar la reservacion'});
                                                }
                                            })
                                        }
                                    })
                                }else{
                                    return res.send({message: 'Fechas no validas'});
                                }
                            }else if(update.checkOut){
                                var checkOut = new Date(update.checkOut);
                                var time = new Date().getTime();
                                var today = new Date(time);
                                if(checkOut >= today && checkOut > reservationFind.checkIn){
                                    Reservation.findOne({checkIn: {$gte: reservationFind.checkIn}, checkOut: {$lte: update.checkOut}, _id: {$ne: reservationFind._id}}, (err, reservationFindMatch)=>{
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar otras reservacion que coincidadn con la fecha'});
                                        }else if(reservationFindMatch){
                                            return res.status(404).send({message:'La haitacion no esta diponible'});
                                        }else{
                                            Reservation.findByIdAndUpdate(reservationId, update, {new: true}, (err, reservationUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al actualizar la reservacion'});
                                                }else if(reservationUpdate){
                                                    return res.status(200).send({message:'Reservacion actualizada', reservationUpdate});
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar la reservacion'});
                                                }
                                            })
                                        }
                                    })
                                }else{
                                    return res.send({message: 'Fechas no validas'});
                                }
                            }
                        }else{
                            return res.status(404).send({message:'No se encontro la reservacion'});
                        }
                    })
                }else{
                    return res.status(404).send({message:'Ingrese algun paramtero para actualizar'});
                }
            }else{
                return res.status(404).send({message:'No se encontro el usuario'});
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

/* function listReservationDisp(req, res){
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
} */

function listAvailableRooms(req, res){
    let hotelId = req.params.hid;
    var time = new Date().getTime();
    var today = new Date('10/11/2021');
    var yesterday = new Date(today-86400000);
    var tomorrow = new Date(today+86400000);
    Hotel.findById(hotelId).exec((err,hotelFind)=> {
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(hotelFind){
            Reservation.find({checkIn: {$gte: yesterday}, checkOut: {$lte: tomorrow}}).exec((err,reservationFind)=> {
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(reservationFind){
                    var unique = reservationFind.map(reservationItem => reservationItem.room).filter((v,i,a)=> a.indexOf(v) === i)
                    console.log(unique)
                    Room.find({_id: {$nin: unique}, hotel: hotelId}).exec((err,findRooms)=> {
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(findRooms){
                            return res.send({message: `Habitaciones Disponibles (${findRooms.length})` ,Habitaciones: findRooms});
                        }else{
                            return res.status(404).send({message:'No hay habitaciones reservadas'});
                        }
                    })
                }else{
                    return res.status(404).send({message:'No hay habitaciones reservadas'});
                }
            })
        }else{
            return res.status(404).send({message:'No hay habitaciones reservadas'});
        }
    })
    }

function listNotAvailableRooms(req, res){
    let userId = req.params.id;
    let hotelId = req.params.hid;


    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'});
    }else{
        var time = new Date().getTime();
        var today = new Date('10/11/2021');
        var yesterday = new Date(today-86400000);
        var tomorrow = new Date(today+86400000);
        Hotel.findById(hotelId).exec((err,hotelFind)=> {
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(hotelFind){
                Reservation.find({checkIn: {$gte: yesterday}, checkOut: {$lte: tomorrow}}).exec((err,reservationFind)=> {
                    if(err){
                        return res.status(500).send({message: 'Error general'});
                    }else if(reservationFind){
                        var unique = reservationFind.map(reservationItem => reservationItem.room).filter((v,i,a)=> a.indexOf(v) === i)
                        console.log(unique)
                        Room.find({_id: {$in: unique}, hotel: hotelId}).exec((err,findRooms)=> {
                            if(err){
                                return res.status(500).send({message: 'Error general'});
                            }else if(findRooms){
                                return res.send({message: `Habitaciones Ocupadas (${findRooms.length})`, Habitaciones: findRooms});
                            }else{
                                return res.status(404).send({message:'No hay habitaciones reservadas'});
                            }
                        })
                    }else{
                        return res.status(404).send({message:'No hay habitaciones reservadas'});
                    }
                })
            }else{
                return res.status(404).send({message:'No hay habitaciones reservadas'});
            }
        })
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
    let userId = req.params.id;
    let reservationId = req.params.idR;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(403).send({message: 'No tienes permiso para hacer esto'});
    }else{
        Reservation.findOne({_id: reservationId, user: userId}, (err, reservationFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al buscar la reservacion'});
            }else if(reservationFind){
                User.findOne({_id: userId}, (err, userFind) => {
                    if(err){
                        return res.status(500).send({message:'Error al buscar usuario'});
                    }else if(userFind){
                        bcrypt.compare(params.password, userFind.password, (err, equalsPassword) => {
                            if(err){
                                return res.status(500).send({message:'Error al comparar contraseñas'});
                            }else if(equalsPassword){
                                User.findOneAndUpdate({_id: userId, reservations: reservationId},
                                    {$pull:{reservations: reservationFind._id}}, {new:true}, (err, servicePull)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al eliminar la reservacion del usuario'});
                                        }else if(servicePull){
                                            Reservation.findByIdAndRemove(reservationId, (err, reservationRemoved)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general al eliminar la reservacion'});
                                                }else if(reservationRemoved){
                                                    return res.send({message: 'Se ha eliminado la reservación'});
                                                }else{
                                                    return res.status(403).send({message: 'No se eliminó la reservación'});
                                                }
                                            })
                                        }else{
                                            return res.status(500).send({message: 'No se pudo eliminar la reservacion del usuario'});
                                        }
                                    })
                            }else{
                                return res.status(404).send({message:'No hay coincidencias en la password'});
                            }
                        })
                    }else{
                        return res.status(404).send({message:'Tu password es incorrecta'});
                    }
                }) 
            }else{
                return res.status(403).send({message: 'La reservación no fue encontrada'});
            } 
        })
    }
}

function findReservationBynameUser(req, res){
    var params = req.body;

    if(params.search){
        User.find({$or:[{name: params.search}]}, (err, resultSearch)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(resultSearch){
                Reservation.find({_id: [resultSearch._id]},(err, reservationFind) => {
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

function addService(req, res){
    var userId = req.params.id;
    var serviceId = req.params.idS;
    var reservationId = req.params.Rid;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        Reservation.findOne({_id: reservationId, user: userId}).exec((err, reservationFind)=>{
            if(err){
                return res.status(400).send({message:'Error general al intentar buscar la reservacion'});
            }else if(reservationFind){
                Room.findOne({_id: reservationFind.room}).exec((err, roomFind) => {
                    if(err){
                        return res.status(500).send({message:'Error general al buscar habitacion'})
                    }else if(roomFind){
                        Hotel.findById(roomFind.hotel).exec((err, hotelFind) => {
                            if(err){
                                return res.status(500).send({message:'Error general al buscar hotel'})
                            }else if(hotelFind){
                                Service.findById(serviceId).exec((err, resultSearch) => {
                                    if(err){
                                        return res.status(500).send({message:'Error general al buscar servicios'})
                                    }else if(resultSearch && !reservationFind.services.includes(resultSearch._id) && hotelFind.services.includes(resultSearch._id)){
                                        console.log(resultSearch)
                                        Reservation.findByIdAndUpdate(reservationId, {$push:{services: resultSearch._id}}, {new: true}, (err, servicePush)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al agergar servicio'})
                                            }else if(servicePush){
                                                return res.send({message:'El servicio se agrego exitosamente', showService: servicePush});
                                            }else{
                                                return res.status(404).send({message: 'Error al agregar servicio'})
                                            }
                                        })
                                    }else if(resultSearch && reservationFind.services.includes(resultSearch._id)){
                                        return res.status(404).send({message:'Servicio ya agregado previamente a la reservacion'})
                                    }else if(resultSearch && !hotelFind.services.includes(resultSearch._id)){
                                        return res.status(404).send({message:'Servicio no disponible en el hotel'})
                                    }else{
                                        return res.status(404).send({message:'No se encontro el servicio'})
                                    }
                                })
                            }else{
                                return res.status(404).send({message:'Busqueda sin coincidencias para el hotel'})
                            }
                        })
                    }else{
                        return res.status(404).send({message:'Busqueda sin coincidencias para la haitacion'})
                    }
                })
            }else{
                return res.status(404).send({message:'No se ha encontrado la reservacion'});
            }
        }) 
    }
}

function removeService(req, res){
    var userId = req.params.id;
    var serviceId = req.params.idS;
    var reservationId = req.params.Rid;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        Reservation.findOne({_id: reservationId, user: userId}).exec((err, reservationFind)=>{
            if(err){
                return res.status(400).send({message:'Error general al intentar buscar la reservacion'});
            }else if(reservationFind){
                Reservation.findOneAndUpdate({_id: reservationId, services: serviceId},
                    {$pull:{services: serviceId}}, {new:true}, (err, servicePull)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al remover el servicio de la reservacion'});
                        }else if(servicePull){
                            return res.send({message: 'El servicio fue removido de la reservacion'});
                        }else{
                            return res.status(500).send({message: 'No se pudo remover el servicio de la reservacion o ya ha sidio eliminado'});
                        }
                    }).populate('services')
            }else{
                return res.status(404).send({message:'No se ha encontrado la reservacion'});
            }
        }) 
    }
}

function mostRequestHotel(req, res){
    var userId = req.params.id;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        Reservation.aggregate([{$group: {_id:'$hotel', reservations: {$sum:1}}}]).sort({reservations: "desc"}).exec((err,reservationFind)=>{
            if(err){
                return res.status(400).send({message:'Error general al intentar buscar las reservaciones'});
            }else if(reservationFind){
                return res.status(400).send({message:'Haitaciones mas solicitadas' ,reservationFind});
            }else{
                return res.status(404).send({message:'No se ha encontrado las reservaciones'});
            }
        })     
    }
}

function createPDF(req,res){
    /* let hotelId = req.params.hid;
    Reservation.find({}).populate("hotel").populate('user').exec((err, reservations)=>{
        if(err){
            return res.status(500).send({message: 'Error general en el servidor'})
        }else if(reservations.length > 0){
            var pdfName = reservations[0].hotel.nameHotel.replace(/[' ']/g, '_')+`_Reservations-${hotelId}.pdf`;
            var reservationsInfo = []
            reservations.map(reservation => {
                var user = reservation.user
                var hotel = reservation.hotel
                reservationsInfo.push([user.name,user.lastname,user.phone,user.email,reservation.checkIn]);
                if(reservation._id == reservations[reservations.length - 1]._id){
                    const table0 = {
                        headers: ['Name', 'Lastname', 'Phone', 'Email', 'CheckIn'],
                        rows: reservationsInfo
                    };
                    doc.pipe(fs.createWriteStream(`./uploads/pdf/${pdfName}`))
                    doc.text(hotel.name,{align: 'center'}).font('Helvetica')
                    doc.moveDown(1);
                    doc.table(table0, {
                        prepareHeader: () => doc.font('Helvetica-Bold'),
                        prepareRow: (row, ix) => doc.font('Helvetica').fontSize(12)
                    });
                    doc.end();
                }
            })
            return res.send({message: 'PDF created'})
        }else{
            console.log(reservations)
            return res.send({message: 'No hay reservaciones para realizar una estadistica'})
        }
    }) */
}

function receipt(req,res){
    let userId = req.params.id;
    let reservationId = req.params.idR;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        Reservation.findById(reservationId).populate("hotel").populate('user').populate('services').populate('room').exec((err, reservationFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al buscar la reservacion'})
            }else if(reservationFind){
                var pdfName = reservationFind.hotel.nameHotel.replace(/[' ']/g, '_')+`_Reservation-${reservationId}.pdf`;
                
                var user = reservationFind.user
                var hotel = reservationFind.hotel
                var room = reservationFind.room
                var totalService = reservationFind.services.map(service => service.price).reduce((a,b) => a+b,0)
                var reservationInfo = []
                var servicesInfo = []
                var days = (reservationFind.checkOut.getTime()-reservationFind.checkIn.getTime()) / (1000*3600*24);
                reservationInfo.push([hotel.nameHotel,hotel.address,reservationFind.checkIn.toDateString(),reservationFind.checkOut.toDateString(),room.nameRoom,room.price]);
                reservationFind.services.map(service => {
                    servicesInfo.push([service._id,service.nameService,service.price]);
                });
                
                const table0 = {
                    headers: ['Hotel', 'Direccion', 'CheckIn', 'CheckOut', 'Room','Price per day'],
                    rows: reservationInfo,
                };
                const table1 = {
                    headers: ['ID','Service', 'Price'],
                    rows: servicesInfo,
                };
                doc.pipe(fs.createWriteStream(`./uploads/pdf/receipts/${pdfName}`))
                doc.text(`Reservation ID:${reservationFind._id}`,{align: 'center'}).font('Helvetica')
                doc.moveDown(1);
                doc.text(`Cliente: ${user.lastname}, ${user.name}`,{align: 'center'}).font('Helvetica')
                doc.moveDown(3);
                doc.table(table0, {
                    prepareHeader: () => doc.font('Helvetica-Bold'),
                    prepareRow: (row, ix) => doc.font('Helvetica').fontSize(12)
                });
                doc.moveDown(1);
                doc.font('Helvetica-Bold').text(`Total for room: ${room.price*days}`,{align: 'right', fontWeight: 'bold'})
                doc.moveDown(3);
                doc.table(table1, {
                    prepareHeader: () => doc.font('Helvetica-Bold'),
                    prepareRow: (row, ix) => doc.font('Helvetica').fontSize(12)
                });
                doc.moveDown(1);
                doc.font('Helvetica-Bold').text(`Total for services: ${totalService}`,{align: 'right'})
                doc.moveDown(1);
                doc.font('Helvetica-Bold').text(`Total: ${totalService+room.price*days}`,{align: 'right'})
                doc.end();
                return res.send({message: 'PDF created'})
            }else{
                console.log(reservations)
                return res.send({message: 'No se ha encontrado la reservacion'})
            }
        })
    }
}

function statisticsByHotel(req, res){
    var userId = req.params.id;
    var hotelId = req.params.hid;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        Hotel.findById(hotelId).sort({reservations: "desc"}).exec((err,hotelFind)=>{
            if(err){
                return res.status(400).send({message:'Error general al intentar buscar las reservaciones'});
            }else if(hotelFind){
                Reservation.find({hotel: hotelId}).sort({reservations: "desc"}).populate('hotel').exec((err,reservationFind)=>{
                    if(err){
                        return res.status(400).send({message:'Error general al intentar buscar las reservaciones'});
                    }else if(reservationFind){
                        Reservation.aggregate([{$match:{"hotel":reservationFind[0].hotel._id}},{$group: {_id:'$room', times: {$sum:1}}}]).sort({reservations: "desc"}).exec((err,mostReservedRoom)=>{
                            if(err){
                                return res.status(400).send({message:'Error general al intentar buscar las reservaciones'});
                            }else if(mostReservedRoom){
                                console.log(mostReservedRoom)
                                return res.status(400).send({message: `Hotel: ${hotelFind.nameHotel}`,
                                                                'Reservaciones': reservationFind.length,
                                                                'Habitacion mas reservada': {Room:mostReservedRoom[0]._id, Cantidad: mostReservedRoom[0].times}});
                            }else{
                                return res.status(404).send({message:'No se ha encontrado las reservaciones'});
                            }
                        })   
                    }else{
                        return res.status(404).send({message:'No se ha encontrado las reservaciones'});
                    }
                })    
            }else{
                return res.status(404).send({message:'No se ha encontrado las reservaciones'});
            }
        })     
    }
}

module.exports = {
    createReservation,
    updateReservation,
    listReservation,
    listAvailableRooms,
    listNotAvailableRooms,
    listReservationNoDisp,
    removeReservation,
    findReservationBynameUser,
    addService,
    removeService,
    mostRequestHotel,
    createPDF,
    statisticsByHotel,
    receipt
}
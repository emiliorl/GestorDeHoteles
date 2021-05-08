'use strict'

var Hotel = require('../models/hotel.model')
var Room = require('../models/room.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function prueba(req, res){
    console.log(req.user);
    res.status(200).send({message: 'Correcto'});
}

function setRoom(req, res){
    var hotelId = req.params.id;
    var params = req.body;
    var room = new Room();

    if(hotelId != req.hotel.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        Hotel.findById(hotelId, (err, hotelFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(hotelFind){
                room.nameRoom = params.nameRoom;
                room.price = params.price;
                room.description = params.description;
                room.status = params.status;
                room.save((err, roomSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar'})
                    }else if(roomSaved){
                        Hotel.findByIdAndUpdate(hotelId, {$push:{rooms: roomSaved._id}}, {new: true}, (err, roomPush)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al agregar habitación'})
                            }else if(roomPush){
                                return res.send({message: 'Contacto agregado', roomPush});
                            }else{
                                return res.status(500).send({message: 'Error al agregar habitación'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'No se guardó el habitación'})
                    }
                })
            }else{
                return res.status(404).send({message: 'El hotel al que deseas agregar la habitación no existe.'})
            }
        })
    }
}

function updateRoom(req, res){
    let roomId = req.params.id;
    let update = req.body;

    if(roomId != req.room.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.price){
            return res.status(401).send({ message: 'No se puede actualizar el precio desde esta función'});
        }else{
            if(update.nameRoom){
                Room.findOne({nameRoom: update.nameRoom.toLowerCase()}, (err, roomFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general'});
                    }else if(roomFind){
                        return res.send({message: 'No se puede actualizar, nombre de habitación ya en uso'});
                    }else{
                        Room.findByIdAndUpdate(roomId, update, {new: true}, (err, roomUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(roomUpdated){
                                return res.send({message: 'Habitación actualizada', roomUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar a la habitación'});
                            }
                        })
                    }
                })
            }else{
                Room.findByIdAndUpdate(roomId, update, {new: true}, (err, roomUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'});
                    }else if(roomUpdated){
                        return res.send({message: 'Habitación actualizada', roomUpdated});
                    }else{
                        return res.send({message: 'No se pudo actualizar a la habitación'});
                    }
                })
            }
        }
    }
    
}

function removeRoom(req, res){
    let roomId = req.params.id;
    let params = req.body;

    if(roomId != req.room.sub){
        return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        Room.findOne({_id: roomId}, (err, roomFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al eliminar'});
            }else if(roomFind){
                bcrypt.compare(params.password, roomFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al verificar contraseña'});
                    }else if(checkPassword){
                        Room.findByIdAndRemove(roomId, (err, roomRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar'});
                            }else if(roomRemoved){
                                return res.send({message: 'Habitación eliminada'});
                            }else{
                                return res.status(403).send({message: 'Habitación no eliminada'});
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'Contraseña incorrecta, no puedes eliminar la habitación'});
                    }
                })
            }else{
                return res.status(403).send({message: 'Habitación no eliminada'});
            } 
        })
    }
}

function listRoom(req, res){
    let roomId = req.params.id;
    
    if(roomId != req.room.sub){
        return res.status(404).send({message:'No tienes permiso para realizar esta funcion'});
    }else{
        Room.find((err, roomFind) => {
            if(err){
                return res.status(500).send({message:'Error general al intentar listar habitaciones'});
            }else if(roomFind){
                return res.send({message:'Listado de habitaciones registradas', listRooms: roomFind});
            }else{
                return res.status(404).send({message:'No hay habitaciones registradas'});
            }
        })
    }
}

module.exports = {
    prueba,
    setRoom,
    updateRoom,
    removeRoom,
    listRoom
}
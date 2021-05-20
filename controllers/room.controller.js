'use strict'

var Hotel = require('../models/hotel.model')
var Room = require('../models/room.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

//Function setRoom creado
function setRoom(req, res){
    var userId = req.params.id;
    var hotelId = req.params.hid;
    var params = req.body;
    var room = new Room();
    params.nameRoom = params.nameRoom.toLowerCase();

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        if(params.nameRoom && params.price){
            Hotel.findById(hotelId, (err, hotelFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(hotelFind.user == userId){
                    Room.findOne({nameRoom: params.nameRoom, hotel: hotelId},(err, roomFind) =>{
                        if(err){
                            return res.status(500).send({message: 'Error general al buscar la habitacion'})
                        }else if(roomFind){
                            return res.status(404).send({message: 'Una haitacion con este nombre ya existe'})
                        }else{
                            room.nameRoom = params.nameRoom.toLowerCase();
                            room.price = params.price;
                            room.description = params.description;
                            room.status = params.status;
                            room.hotel = hotelId;
                            room.save((err, roomSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar'})
                                }else if(roomSaved){
                                    Hotel.findByIdAndUpdate(hotelId, {$push:{rooms: roomSaved._id}}, {new: true}, (err, roomPush)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al agregar habitación'})
                                        }else if(roomPush){
                                            return res.send({message: 'Haitación agregada', roomSaved});
                                        }else{
                                            return res.status(500).send({message: 'Error al agregar habitación'})
                                        }
                                    })
                                }else{
                                    return res.status(404).send({message: 'No se guardó el habitación'})
                                }
                            })
                        }
                    })
                }else{
                    return res.status(404).send({message: 'El hotel al que deseas agregar la habitación no existe.'})
                }
            })
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }
}

function updateRoom(req, res){
    let userId = req.params.id;
    let hotelId = req.params.hid;
    let roomId = req.params.idR;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
        
        Hotel.findById(hotelId, (err, hotelFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(hotelFind.user == userId){
                Room.findOne({nameRoom: params.nameRoom, hotel: hotelId},(err, roomFind) =>{
                    if(err){
                        return res.status(500).send({message: 'Error general al buscar la habitacion'})
                    }else if(roomFind){
                        if(update.nameRoom){
                            update.nameRoom  = update.nameRoom.toLowerCase();
                            Room.findOne({nameRoom: params.nameRoom, hotel: hotelId}, (err, roomFind)=>{
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
                    }else{
                        return res.status(404).send({message: 'La habitacion que deseas actualizar no existe.'})
                    }
                })
            }else{
                return res.status(404).send({message: 'El hotel al que deseas actualizar la habitación no existe.'})
            }
        })
    }
    
}

function removeRoom(req, res){
    let roomId = req.params.id;
    let params = req.body;

    if(roomId != req.room.sub){
        return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        Hotel.findById(hotelId, (err, hotelFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(hotelFind.user == userId){
                Room.findOne({nameRoom: params.nameRoom, hotel: hotelId},(err, roomFind) =>{
                    if(err){
                        return res.status(500).send({message: 'Error general al buscar la habitacion'})
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
                        return res.status(404).send({message: 'La habitacion que deseas actualizar no existe.'})
                    }
                })
            }else{
                return res.status(404).send({message: 'El hotel al que deseas agregar la habitación no existe.'})
            }
        })
    }
}

function listRoom(req, res){
    let hotelId = req.params.hid;

    Hotel.findById(hotelId).exec((err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener el hotel'});
        }else if(hotelFind){
            Room.find({"hotel": hotelId}).select("-_id -hotel -__v").exec((err, roomFind) => {
                if(err){
                    return res.status(500).send({message:'Error general al intentar listar habitaciones'});
                }else if(roomFind){
                    return res.send({message:'Listado de habitaciones registradas', listRooms: roomFind});
                }else{
                    return res.status(404).send({message:'No hay habitaciones registradas'});
                }
            })
        }else{
            return res.status(404).send({message:'No se encontro el hotel'});
        }
    });
    
}

module.exports = {
    setRoom,
    updateRoom,
    removeRoom,
    listRoom
}
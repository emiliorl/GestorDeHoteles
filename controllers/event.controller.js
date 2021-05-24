'use strict'

var Event = require('../models/event.model');
var Hotel = require('../models/hotel.model');

//---------------------------------------------
//  CRUD de event
//--------------------------------------------
function createEvent(req, res){
    var params = req.body;
    var userId = req.params.id;
    var hotelId = req.params.hid;

    if(req.user.sub != userId){
        return res.status(500).send({message: 'No tienes permiso para acceder a esta función.'});
    }else{
        if(params.nameEvent && params.date && params.typeEvent){
            Hotel.findById(hotelId, (err, hotelFind) => {
                if(err){
                    return res.status(400).send({message:'Error general al intentar buscar el hotel'});
                }else if(hotelFind.user == userId){
                    let event = new Event();
                    event.date = params.date;
                    var time = new Date().getTime();
                    var today = new Date(time);
                    if(event.date >= today){
                        event.nameEvent = params.nameEvent;
                        event.typeEvent = params.typeEvent;
                        event.description = params.description;
                        event.hotel = hotelId;
                        console.log(event)
                        event.save((err, saveEvent)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar el evento' + err});
                            }else if(saveEvent){
                                return res.send({message: 'El evento fue guardado', saveEvent});
                            }else{
                                return res.send({message: 'No se pudo agregar el evento'});
                            }
                        });
                    }else{
                        return res.send({message: 'Fecha no valida'});
                    }
                    
                }else{
                    return res.status(404).send({message:'No se ha encontrado el hotel'});
                }
            })
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }
}

function deleteEvent(req, res){
    var userId = req.params.id;
    var hotelId = req.params.hid;
    var eventId = req.params.idE;

    if(req.user.sub != userId){
        return res.status(500).send({message: 'No tienes permisos para esta funcion'});
    }else{
        Hotel.findById(hotelId, (err, hotelFind) => {
            if(err){
                return res.status(400).send({message:'Error general al intentar buscar el hotel'});
            }else if(hotelFind.user == userId){
                Event.findById(eventId).exec((err, eventFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al intentar buscar un evento '});
                    }else if(eventFind._id == eventId){
                        Event.findByIdAndRemove({_id : eventId}, (err, eventDelete)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al intentar eliminar el evento'});
                            }else if(eventDelete){
                                return res.send({message: 'El evento fue eliminado satisfactoriamente'});
                            }else{   
                                return res.send({message: 'No se pudo eliminar el evento'});
                            }
                        }); 
                    }else{
                        return res.status(500).send({message: 'No se encontro ningún evento'});
                    }
                });
            }else{
                return res.status(404).send({message:'No se ha encontrado el hotel'});
            }
        })
    }
}

function updateEvent(req, res){
    let update = req.body;
    var userId = req.params.id;
    let idEvent = req.params.idE;
    let hotelId = req.params.hid;

    if(req.user.sub != userId){
        return res.status(500).send({message: 'No tienes permisos para esta funcion'});
    }else{
        Event.findOne({_id : idEvent}, (err, eventFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al buscar el evento a actualizar'});
            }else if(eventFind){

                Hotel.findById(hotelId, (err, hotelFind) => {
                    if(err){
                        return res.status(400).send({message:'Error general al intentar buscar el hotel'});
                    }else if(hotelFind.user == userId){

                        if(update.date){
                            var time = new Date().getTime();
                            var today = new Date(time);
                            var updateDate = new Date(update.date);
                            console.log(updateDate)
                            if(updateDate >= today){
                                Event.findByIdAndUpdate( idEvent, update, {new : true}, (err, eventUpdated)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al actualizar'});
                                    }else if(eventUpdated){
                                        return res.send({message: 'El evento se actualizo correctamente', eventUpdated});
                                    }else{
                                        return res.send({message: 'El evento no se pudo actualizar'});
                                    }
                                });
                            }else{
                                return res.send({message: 'Fecha no valida'});
                            }
                        }else{
                            Event.findByIdAndUpdate( idEvent, update, {new : true}, (err, eventUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(eventUpdated){
                                    return res.send({message: 'El evento se actualizo correctamente', eventUpdated});
                                }else{
                                    return res.send({message: 'El evento no se pudo actualizar'});
                                }
                            });
                        }
                        
                    }else{
                        return res.status(404).send({message:'No se ha encontrado el hotel'});
                    }
                })
            }else{
                return res.send({message: 'El evento a actualizar no se encontró'});
            }
        });
    }
}

function listEvent(req, res){
    let hotelId = req.params.hid;

    Hotel.findById(hotelId).exec((err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener el hotel'});
        }else if(hotelFind){
            Event.find({"hotel": hotelId}).select("-_id -hotel -__v").exec((err, eventsFind) => {
                if(err){
                    return res.status(500).send({message:'Error general al buscar eventos'})
                }else if(eventsFind.length > 0){
                    return res.send({message:'Los eventos encontrados son los siguientes', eventsFind});
                }else{
                    return res.status(404).send({message:'No se encontrarón eventos.'})
                }
            })
        }else{
            return res.status(404).send({message:'No se encontro el hotel'});
        }
    });
}

function getEvent(req, res){
    let params = req.body;
    let hotelId = req.params.hid;

    Hotel.findById(hotelId).exec((err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener el hotel'});
        }else if(hotelFind){
            if(params.search){
                var valid = new Date(params.search)
                if('Invalid Date' != valid){
                    return res.send({mensaje: 'La fecha de busqueda es correcta'});
                }
                Event.find({$or : [{nameEvent : {$regex: params.search}},
                                {typeEvent : {$regex: params.search}}], 
                                hotel : hotelId}, {'_id': 0, 'hotel': 0, '__v': 0}, (err, eventsFind)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al buscar los eventos' + err});
                                    }else if(eventsFind){
                                        return res.send({message: 'Los eventos encontrados son los siguientes', eventsFind});
                                    }else{
                                        return res.send({message: 'No se encontrarón eventos.'});   
                                    }
                                });
            }else{
                return res.send({mensaje: 'Ingrese en el campo de busqueda'});
            }
        }else{
            return res.status(404).send({message:'No se encontro el hotel'});
        }
    });
}

module.exports = {
    createEvent,
    deleteEvent,
    updateEvent,
    listEvent,
    getEvent
}
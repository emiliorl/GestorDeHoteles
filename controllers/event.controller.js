'use strict'

var Event = require('../models/event.model');

//---------------------------------------------
//  CRUD de event
//--------------------------------------------
function createEvent(req, res){
    var params = req.body;
    var userId = req.params.id;
    if(req.user.sub != userId){
        return res.status(500).send({message: 'No tienes permiso para acceder a esta función.'});
    }else{
        if(params.nameEvent && params.date && typeEvent){
            let event = new Event();
            event.nameEvent = params.nameEvent;
            event.typeEvent = params.typeEvent;
            event.description = params.description;
            event.date = params.date;
            event.save((err, saveEvent)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al guardar el hotel'});
                }else if(saveEvent){
                    return res.send({message: 'El evento fue guardado'});
                }else{
                    return res.send({message: 'No se pudo agregar el evento'});
                }
            });
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }
}

function deleteEvent(req, res){
    let params = req.body;
    var userId = req.params.id;
    if(req.user.sub != userId){
        return res.status(500).send({message: 'No tienes permisos para esta funcion'});
    }else{
        if(params.nameEvent){
            Event.findOne({nameEvent : params.nameEvent}, (err, deleteEvent=>{
                if(err){
                    return res.status(500).send({message: 'Error general al intentar buscar un evento '});
                }else if(deleteEvent){
                   Event.findOneAndDelete({nameEvent : params.nameEvent}, (err, eventDelete)=>{
                       if(err){
                        return res.status(500).send({message: 'Error general al intentar eliminar el evento'});
                       }else if(eventDelete){
                        return res.send({message: 'El evento fue eliminado satisfactoriamente'});
                       }else{   
                        return res.send({message: 'No se pudo eliminar el evento'});
                       }
                   }); 
                }else{
                    return res.status(500).send({message: 'No se encontro ningún evento con dicho nombre'});
                }
            }));
        }
    }
}

function updateEvent(req, res){
    let upate = req.body;
    var userId = req.params.id;
    let idEvent = req.params.idE;
    if(req.user.role != userId){
        return res.status(500).send({message: 'No tienes permisos para esta funcion'});
    }else{
        Event.findOne({_id : idEvent}, (err, eventFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al buscar el evento a actualizar'});
            }else if(eventFind){
                Event.findByIdAndUpdate( idEvent, upate, {new : true}, (err, eventUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'});
                    }else if(eventUpdated){
                        return res.send({message: 'El evento se actualizo correctamente', eventUpdated});
                    }else{
                        return res.send({message: 'El evento no se pudo actualizar'});
                    }
                });
            }else{
                return res.send({message: 'El evento a actualizar no se encontró'});
            }
        });
    }
}

function listEvent(req, res){
    Event.find({}, (err, eventsFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al buscar los eventos'});
        }else if(eventsFind){
            return res.send({message: 'Los eventos encontrados son los siguientes', eventsFind});
        }else{
            return res.send({message: 'No se encontrarón eventos. '});
        }
    });
}

function getEvent(req, res){
    let params = req.body;

    if(params.search){
        Event.find({$or : [{nameEvent : params.search},
                        {typeEvent : params.search},
                        {date : params.search}]}, (err, eventsFind)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al buscar los eventos'});
                            }else if(eventsFind){
                                return res.send({message: 'Los eventos encontrados son los siguientes', eventsFind});
                            }else{
                                return res.send({message: 'No se encontrarón eventos.'});   
                            }
                        });
    }else{
         return res.send({mensaje: 'Ingrese en el campo de busqueda'});
    }
}

module.exports = {
    createEvent,
    deleteEvent,
    updateEvent,
    listEvent,
    getEvent
}
'use strict'

var User = require('../models/user.model');
var Service = require('../models/service.model');
var Hotel = require('../models/hotel.model')
var bcrypt = require('bcrypt-nodejs');

//funciones de ADMIN y ADMIN_HOTEL
function createService(req, res){
    var userId = req.params.id;
    var hotelId = req.params.hid;
    var service = new Service();
    var params = req.body;
    params.nameService = params.nameService.toLowerCase();

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        if(params.nameService && params.price){
            Hotel.findById(hotelId, (err, hotelFind) => {
                if(err){
                    return res.status(400).send({message:'Error general al intentar buscar el hotel'});
                }else if(hotelFind.user == userId){
                    Service.findOne({nameService: params.nameService, _id: {"$in": hotelFind.services}}, (err, findService) => {
                        if(err){
                            return res.status(400).send({message:'Error general al intentar buscar Service'});
                        }else if(findService){
                            return res.send({message:'Este servicio ya ha sido creado anteriormente'});
                        }else{   
                            service.nameService = params.nameService.toLowerCase();
                            service.price = params.price;
                
                            service.save((err, serviceSaved) => {
                                if(err){
                                    return res.status(400).send({message:'Error general al intentar crear Service'});
                                }else if(serviceSaved){
                                    Hotel.findByIdAndUpdate(hotelId, {$push:{services: serviceSaved._id}}, {new: true}, (err, servicePush)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al agergar servicio'})
                                        }else if(servicePush){
                                            return res.send({message:'El servicio se creo exitosamente', showService: serviceSaved});
                                        }else{
                                            return res.status(500).send({message: 'Error al agregar servicio'})
                                        }
                                    })
                                }else{
                                    return res.status(400).send({message:'No sea ha podido crear el servicio'});
                                }
                            })
                        }
                    })
                }else{
                    return res.status(404).send({message:'No se ha encontrado el hotel'});
                }
            })
        }else{
            return res.status(400).send({message:'Por favor ingresa todos los parametros'});
        }        
    }
}

function deleteService(req, res){
    var userId = req.params.id;
    var hotelId = req.params.hid;
    var serviceId = req.params.idS;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        if(params.nameService && params.passwordAdmin){
            Hotel.findById(hotelId, (err, hotelFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar hotel'});
                }else if(hotelFind.user == userId){
                    User.findOne({_id: userId}, (err, userFind) => {
                        if(err){
                            return res.status(500).send({message:'Error al buscar usuario'});
                        }else if(userFind){
                            bcrypt.compare(params.passwordAdmin, userFind.password, (err, equalsPassword) => {
                                if(err){
                                    return res.status(500).send({message:'Error al comparar contraseñas'});
                                }else if(equalsPassword){
                                    Service.findOne({nameService: params.nameService}, (err, findService) => {
                                        if(err){
                                            return res.status(500).send({message:'Error general al intentar buscar Service'});
                                        }else if(!findService){            
                                            return res.status(400).send({message:'El nombre del servicio no existe o es erroneo'});
                                        }else if(findService._id == serviceId){
        
                                            Hotel.findOneAndUpdate({_id: hotelId, services: serviceId},
                                                {$pull:{services: serviceId}}, {new:true}, (err, servicePull)=>{
                                                    if(err){
                                                        return res.status(500).send({message: 'Error general al eliminar el servicio del hotel'});
                                                    }else if(servicePull){
                                                        Service.findByIdAndRemove({_id: findService._id},(err, serviceRemoved) => {
                                                            if(err){
                                                                return res.status(500).send({message:'Error al eliminar servicio'});
                                                            }else if(serviceRemoved){
                                                                return res.send({message: 'El servicio fue eliminado', serviceRemoved});
                                                            }else{
                                                                return res.status(404).send({message:'No se pudo eliminar el servicio o ya fue eliminado'});
                                                            }
                                                        })
                                                    }else{
                                                        return res.status(500).send({message: 'No se pudo eliminar el servicio del hotel'});
                                                    }
                                                }).populate('services')
        
                                        }else{
                                            return res.status(400).send({message:'El nombre del servicio no coincide'});
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
                    return res.status(404).send({message:'No se encontro el hotel'});
                }
            })                  
        }else{
            return res.status(400).send({message:'No olvides colocar el nombre del servicio que eliminaras y tu password de usuario'});
        }
    }
}

function updateService(req, res){
    let userId = req.params.id;
    let hotelId = req.params.hid;
    let serviceId = req.params.idS;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar este servicio'});
    }else{
        Hotel.findById(hotelId, (err, hotelFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar hotel'});
            }else if(hotelFind.user == userId){
                if(update.nameService){
                    update.nameService = update.nameService.toLowerCase();
        
                    Service.findOne({nameService: update.nameService, _id: {$in: hotelFind.services}}, (err, serviceFind) => {
                        if(err){
                            return res.status(500).send({message:'Error al buscar servicio'});
                        }else if(serviceFind && serviceFind._id != serviceId){
                            return res.send({message: 'Servicio ya existente, crea uno nuevo o actualiza el que ya esta creado'})
                        }else{
                            Service.findByIdAndUpdate(serviceId, update, {new: true}, (err, serviceupdate) => {
                                if(err){
                                    return res.status(500).send({message:'Error al actualizar servicio'});
                                }else if(serviceupdate){
                                    return res.status(200).send({message:'Servicio actualizado', serviceupdate});
                                }else{
                                    return res.status(404).send({message:'No se pudo actualizar el servicio'});
                                }
                            })
                        }
                    })
                }else{
                    Service.findByIdAndUpdate(serviceId, update, {new: true}, (err, serviceupdate) => {
                        if(err){
                            return res.status(500).send({message:'Error al actualizar servicio'});
                        }else if(serviceupdate){
                            console.log('Servicio: '+serviceupdate);
                            return res.send({message:'Servicio actualizado', serviceupdate});
                        }else{
                            return res.status(404).send({message:'No se pudo actualizar el servicio'});
                        }
                    })
                }
            }else{
                return res.status(404).send({message:'No se encontro el hotel'});
            }
        })
    }
}
//----------------------------------------------

//funciones para cualquier rol
function listService(req, res){
    var hotelId = req.params.hid;

    Hotel.findById(hotelId).populate('services').select("-_id -user -__v").exec((err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener el hotel'});
        }else if(hotelFind){
            Service.find({_id: {"$in": hotelFind.services}}).exec((err, resultSearch) => {
                if(err){
                    return res.status(500).send({message:'Error general al buscar servicios'})
                }else if(resultSearch){
                    return res.send({message:'Coincidencias encontradas', resultSearch});
                }else{
                    return res.status(404).send({message:'Busqueda sin coincidencias'})
                }
            })
        }else{
            return res.status(404).send({message:'No se encontraro el hotel'});
        }
    })
}

function getService(req, res){
    var hotelId = req.params.hid;
    let params = req.body;

    Hotel.findById(hotelId).select("-_id -user -__v").exec((err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener el hotel'});
        }else if(hotelFind){
            params.search = params.search.toLowerCase();
            Service.find({nameService: params.search, _id: {"$in": hotelFind.services}} , (err, findService) => {
                if(err){
                    return res.status(500).send({message:'Error general al intentar buscar Service'});
                }else if(findService.length > 0){
                    return res.send({message:'Se ha obtenido el servicio', getService: findService});
                }else{            
                    return res.status(400).send({message:'No se encontraron coincidencias'});
                }
            })
        }else{
            return res.status(404).send({message:'No se encontraro el hotel'});
        }
    });
}

module.exports = {
    createService,
    deleteService,
    listService,
    getService,
    updateService
}
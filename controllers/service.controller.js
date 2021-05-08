'use strict'

var User = require('../models/user.model');
var Service = require('../models/service.model');
var bcrypt = require('bcrypt-nodejs');

//funciones de ADMIN y ADMIN_HOTEL
function createService(req, res){
    var userId = req.params.id;
    var service = new Service();
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        if(params.nameService && params.price){
            Service.findOne({nameService: params.nameService}, (err, findService) => {
                if(err){
                    return res.status(400).send({message:'Error general al intentar buscar Service'});
                }else if(findService){
                    return res.send({message:'Este servicio ya ha sido creado anteriormente'});
                }else{            
                    service.nameService = params.nameService;
                    service.price = params.price;
        
                    service.save((err, serviceSaved) => {
                        if(err){
                            return res.status(400).send({message:'Error general al intentar crear Service'});
                        }else if(serviceSaved){
                            return res.send({message:'El servicio se creo exitosamente', showService: serviceSaved});
                        }else{
                            return res.status(400).send({message:'No sea ha podido crear el servicio'});
                        }
                    })
                }
            })
        }else{
            return res.status(400).send({message:'Por favor ingresa todos los parametros'});
        }        
    }
}

function deleteService(req, res){
    var userId = req.params.id;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        if(params.nameService && params.passwordAdmin){
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
                                }else if(findService){
                                    Service.findByIdAndRemove({_id: findService._id},(err, serviceRemoved) => {
                                        if(err){
                                            return res.status(500).send({message:'Error al eliminar servicio'});
                                        }else if(serviceRemoved){
                                            return res.send({message: 'EL servicio fue eliminado', serviceRemoved});
                                        }else{
                                            return res.status(404).send({message:'No se pudo eliminar el servicio o ya fue eliminado'});
                                        }
                                    })
                                }else{            
                                    return res.status(400).send({message:'El nombre del servicio no existe o es erroneo'});
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
            return res.status(400).send({message:'No olvides colocar el nombre del servicio que eliminaras y tu password de usuario'});
        }
    }
}
//----------------------------------------------

//funciones para cualquier rol
function listService(req, res){

    Service.find((err, resultSearch) => {
        if(err){
            return res.status(500).send({message:'Error general'})
        }else if(resultSearch){
            return res.send({message:'Coincidencias encontradas', resultSearch});
        }else{
            return res.status(404).send({message:'Busqueda sin coincidencias'})
        }})
}

function getService(req, res){
    let params = req.body;

    Service.findOne({nameService: params.nameService}, (err, findService) => {
        if(err){
            return res.status(500).send({message:'Error general al intentar buscar Service'});
        }else if(findService){
            return res.send({message:'Se ha obtenido el servicio', getService: findService});
        }else{            
            return res.status(400).send({message:'El nombre del servicio no existe o es erroneo'});
        }
    })
}

module.exports = {
    createService,
    deleteService,
    listService,
    getService
}
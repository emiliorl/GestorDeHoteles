'use strict'

var Hotel = require('../models/hotel.model');
var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs'); 

//--------------
//   Admin
//----------------

function createHotel(req, res){
    let userId = req.params.id;
    let params = req.body;
    if(req.user.sub != userId){
        return res.status(500).send({message: 'No tienes permiso para acceder a esta función.'});
    }else{
        if(params.nameHotel && params.country && params.state && params.city && params.zipCode && params.address && params.phoneHotel && params.hotelAdmin){
            Hotel.findOne({nameHotel : params.nameHotel}, (err, hotelFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar el hotel'});
                }else if(hotelFind){
                    return res.send({message: 'El nombre del hotel ingresado ya esta en uso'});
                }else{
                    User.findById(params.hotelAdmin).exec((err,userFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al buscar el administrador de hotel'});
                        }else if(userFind.rol == "ADMIN_HOTEL"){
                            let hotel = new Hotel();
                            hotel.nameHotel = params.nameHotel;
                            hotel.country = params.country;
                            hotel.state = params.state;
                            hotel.city = params.city;
                            hotel.zipCode = params.zipCode;
                            hotel.address = params.address;
                            hotel.phoneHotel = params.phoneHotel;
                            hotel.description = params.description;
                            hotel.user = params.hotelAdmin;
                            hotel.save((err, hotelSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar el hotel'});
                                }else if (hotelSaved){
                                    return res.send({message: 'El hotel fue guardado satisfactoriamente'});
                                }else{
                                    return res.send({message: 'No se pudo agregar el hotel con exito'});
                                }
                            });
                        }else{
                            return res.send({message: 'No se enccontro ningun usuario con los permisos'});
                        }
                    })
                }
            });
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }
}

function updateHotel(req, res){
    let userId = req.params.id;
    let hotelId = req.params.idH;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar este hotel'});
    }else{
        Hotel.findById(hotelId, (err, hotelFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar hotel'});
            }else if(hotelFind.user == userId){
                if(update.nameHotel){
                    Hotel.findOne({nameHotel: update.nameHotel}, (err, hotelFind) => {
                        if(err){
                            return res.status(500).send({message:'Error al buscar hotel'});
                        }else if(hotelFind){
                            return res.send({message: 'Este nombre de Hotel ya esta en uso'})
                        }else{
                            Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdate) => {
                                if(err){
                                    return res.status(500).send({message:'Error al actualizar servicio'});
                                }else if(hotelUpdate){
                                    return res.status(200).send({message:'Servicio actualizado', hotelUpdate});
                                }else{
                                    return res.status(404).send({message:'No se pudo actualizar el servicio'});
                                }
                            })
                        }
                    })
                }else{
                    Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdate) => {
                        if(err){
                            return res.status(500).send({message:'Error al actualizar hotel'});
                        }else if(hotelUpdate){
                            console.log('Hotel: '+hotelUpdate);
                            return res.send({message:'Hotel actualizado', hotelUpdate});
                        }else{
                            return res.status(404).send({message:'No se pudo actualizar el hotel'});
                        }
                    })
                }
            }else{
                return res.status(404).send({message:'No se encontro el hotel'});
            }
        })
    }
}

function deleteHotel(req, res){
    var userId = req.params.id;
    var hotelId = req.params.idH;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        if(params.passwordAdmin){
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
                                    Hotel.findByIdAndRemove({_id: hotelFind._id},(err, hotelRemoved) => {
                                        if(err){
                                            return res.status(500).send({message:'Error al eliminar el hotel'});
                                        }else if(hotelRemoved){
                                            return res.send({message: 'El hotel fue eliminado', hotelRemoved});
                                        }else{
                                            return res.status(404).send({message:'No se pudo eliminar el hotel o ya fue eliminado'});
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
            return res.status(400).send({message:'No olvides colocar tu password de administrador'});
        }
    }
}

//----------------------------------
//  Funciones generales 
//---------------------------------
function listHotels(req, res){
    
    Hotel.find({}).select("-services -_id -user -__v").exec((err, hotelsFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener hoteles'});
        }else if(hotelsFind){
            return res.send({message: 'Hoteles encontrados', hotelsFind});
        }else{
            return res.status(404).send({message:'No se encontraron hoteles'});
        }
    });
}

function getHotel(req, res,){
    let params = req.body;

    if(params.search){
        Hotel.find({$or : [{nameHotel : {$regex: params.search}},
                            {country : params.search},
                            {state : params.search},
                            {city : params.search},
                            {zipCode : params.search},
                            {address : {$regex: params.search}}]}, {'_id': 0, 'services': 0, 'user': 0, '__v': 0}, (err, resultSerarch)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al buscar hoteles'});
                                }else if(resultSerarch){
                                    return res.send({message: 'Hoteles encontrados', resultSerarch});
                                }else{
                                    return res.status(404).send({message:'No se encontraron coincidencias'});
                                }
                            });
    }else{
        return res.status(404).send({message:'No se encontraron hoteles'});
    }
}

function getHotelsAdmin(req, res){
    let adminHotelId = req.params.id;

    Hotel.find({user: adminHotelId}, (err, hotelsFind) => {
        if(err){
            return res.status(500).send({message: 'Error general al obtener hoteles'});
        }else if(hotelsFind){
            return res.send({message: 'Hoteles encontrados', hotelsFind});
        }else{
            return res.status(404).send({message: 'No se encontraron hoteles o aun no has creado uno'});
        }
    })
}


//------ Exportaciones------------------
module.exports = {
    createHotel,
    updateHotel,
    deleteHotel,
    listHotels, 
    getHotel,
    getHotelsAdmin
}
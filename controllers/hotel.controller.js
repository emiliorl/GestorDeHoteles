'use strict'

var Hotel = require('../models/hotel.model');

//--------------
//   Admin
//----------------

function createHotel(req, res){
    let userId = req.params.id;
    let params = req.body;
    if(req.user.sub != userId){
        return res.status(500).send({message: 'No tienes permiso para acceder a esta función.'});
    }else{
        if(params.nameHotel && params.address && params.phoneHotel){
            Hotel.findOne({nameHotel : params.nameHotel}, (err, hotelFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar el hotel'});
                }else if(hotelFind){
                    return res.send({message: 'El nombre del hotel ingresado ya esta en uso'});
                }else{
                    let hotel = new Hotel();
                    hotel.nameHotel = params.nameHotel;
                    hotel.address = params.address;
                    hotel.phoneHotel = params.phoneHotel;
                    hotel.description = params.description;
                    hotel.save((err, hotelSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al guardar el hotel'});
                        }else if (hotelSaved){
                            return res.send({message: 'El hotel fue guardado satisfactoriamente'});
                        }else{
                            return res.send({message: 'No se pudo agregar el hotel con exito'});
                        }
                    });
                }
            });
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }
}



//----------------------------------
//  Funciones generales 
//---------------------------------
function listHotel(req, res){
    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permisos para proceder a esta función'});
    }else{
        Hotel.find({}).populate('user').exec((err, hotelsFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al obtener hotoles'});
            }else if(hotelsFind){
                return res.send({message: 'Hoteles encontrados', hotelsFind});
            }else{
                return res.status(404).send({message:'No se encontraron hoteles'});
            }
        });
    }
}

function getHotel(req, res,){
    let params = req.body;

    if(params.search){
        Hotel.find({$for : [{nameHotel : params.search},
                            {address : params.search}]}, (err, resultSerarch)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al buscar hoteles'});
                                }else if(resultSerarch){
                                    return res.send({message: 'Hoteles encontrados', resultSerarch});
                                }else{
                                    return res.status(404).send({message:'No se encontraron coincidencias'});
                                }
                            });
    }
}



//------ Exportaciones------------------
module.exports = {
    createHotel,
    listHotel, 
    getHotel
}
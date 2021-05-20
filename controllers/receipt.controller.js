'use strict'

var Receipt = require('../models/receipt.model');
var ServiceAfter = require('../models/service.model');
var Reservation = require('../models/reservation.model');
var User = require('../models/user.model')

//Sirve para crea la factura

function saveReceipt(req, res){
    var userId = req.params.id;
    var receipt = new Receipt();
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para realizar esta funcion'});
    }else{
        if(params.date && params.reservation){

            Reservation.findById(params.reservation , (err, reservationFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar la reservacion'});
                }else if(reservationFind){
                    Receipt.findOne({reservation: params.reservation}, (err, receiptFind) => {
                        if(err){
                            return res.status(500).send({message:'Error al buscar al factura'});
                        }else if(receiptFind){
                            return res.status(404).send({message:'Factura con esta reservacion ya existente'});
                        }else{
                            receipt.date = params.date;
                            receipt.reservation = params.reservation;
                            if(serviceAfter){
                                let total;
                                serviceAfter.map(service => {
                                    return ServiceAfter.findById(service , (err, serviceFind) => {
                                        if(err){
                                            console.log('Error al buscar el servicio' + service.nameService);
                                        }else if(serviceFind){
                                            total += service.price;
                                            console.log('Servicio' + service.nameService);
                                        }
                                    })
                                })
    
                                receipt.serviceAfter = params.serviceAfter;
                                receipt.total = total;
    
                                receipt.save((err, receiptSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al guardar la factura'})
                                    }else if(receiptSaved){
                                        User.findByIdAndUpdate(userId, {$push:{receipts: receiptSaved._id}}, {new: true}, (err, receiptPush)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al agergar factura'})
                                            }else if(receiptPush){
                                                return res.send({message: 'Factura agregada', receiptPush});
                                            }else{
                                                return res.status(500).send({message: 'Error al agregar factura'})
                                            }
                                        })
                                    }else{
                                        return res.status(404).send({message: 'No se guardó la factura'})
                                    }
                                })
                            }
    
                            receipt.save((err, receiptSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar la factura'})
                                }else if(receiptSaved){
                                    User.findByIdAndUpdate(userId, {$push:{receipts: receiptSaved._id}}, {new: true}, (err, receiptPush)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al agergar factura'})
                                        }else if(receiptPush){
                                            return res.send({message: 'Factura agregada', receiptPush});
                                        }else{
                                            return res.status(500).send({message: 'Error al agregar factura'})
                                        }
                                    })
                                }else{
                                    return res.status(404).send({message: 'No se guardó la factura'})
                                }
                            })
                        }
                    })
                }else{
                    return res.status(404).send({message:'Reservacion no encontrada'});
                }
            })
    
        }else{
            return res.send({message:'Ingresa los parametros requeridos'});
        }
    }
}

module.exports = {
    saveReceipt
}
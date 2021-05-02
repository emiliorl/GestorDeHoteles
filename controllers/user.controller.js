'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs'); 
var jwt = require('../services/jwt');

function prueba(req, res){
    return res.send({message:'Correcto'});
    console.log(req.user);
}

//Creacion de ADMIN de forma automatica
function adminInit(req, res){
    let admin = new User();

    admin.username = 'admin';
    admin.password = '12345';
    admin.rol = 'ADMIN';

    User.findOne({username: admin.username}, (err, adminFind) => {
        if(err){
            console.log('Error al crear al admin')
        }else if(adminFind){
            console.log('administrador ya creado');
        }else{
            bcrypt.hash(admin.password, null, null, (err, passwordHash) => {
                if(err){
                    return res.status(500).send({message:'Error al encriptar la contraseña'});
                }else if(passwordHash){
                    admin.password = passwordHash;
                    admin.save((err, adminSaved) => {
                        if(err){
                            console.log('Error al crear el admin');
                        }else if(adminSaved){
                            console.log('Usuario administrador creado');
                        }else{
                            console.log('Usuario administrador no creado');
                        }
                    })
                }else{
                    return res.status(401).send({message:'Password no encriptada'});
                }
            })            
        }
    })
}

//Funciones para un usuario comun

function signIn(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.lastname && params.username && params.phone && params.email && params.password){
        User.findOne({username: params.username.toLowerCase()}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar al usuario'});
            }else if(userFind){
                return res.send({message:'Nombre de usuario ya existente, por favor elije otro'});
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                    if(err){
                        return res.status(500).send({message:'Error al encriptar la contraseña'});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username.toLowerCase();
                        user.rol = "USER";
                        user.phone = params.phone; 
                        user.email = params.email;

                        user.save((err, userSaved) => {
                            if(err){
                                return res.status(500).send({message:'Error al intentar guardar'});
                            }else if(userSaved){
                                return res.send({message:'Te has registrado con exito', userSaved});
                            }else{
                                return res.status(401).send({message:'No se guardo el usuario'});
                            }
                        })
                    }else{
                        return res.status(401).send({message:'Password no encriptada'});
                    }
                })
            }
        })
    }else{
        return res.send({message:'Ingresa todos los parametros minimos'});
    }
}

//---------------------------------------

function logIn(req, res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username.toLowerCase()}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar usuario'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, equalsPassword) => {
                    if(err){
                        return res.status(500).send({message:'Error al comparar contraseñas'});
                    }else if(equalsPassword){
                        if(params.gettoken){
                            return res.send({ token: jwt.createToken(userFind), user: userFind});
                        }else{
                            return res.send({message:'Usuario logeado'});
                        }
                    }else{
                        return res.status(404).send({message:'No hay coincidencias en la password'});
                    }
                })
            }else{
                return res.status(404).send({message:'Usuario no encontrado'});
            }
        })
    }else{
        return res.status(404).send({message:'Por favor llena los campos obligatorios'});
    }
}

//Funciones para administrador

function listUser(req, res){
    let userId = req.params.id;
    
    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para realizar esta funcion'});
    }else{
        User.find((err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error general al intentar listar usuarios'});
            }else if(userFind){
                return res.send({message:'Listado de usuarios registrados', listUsers: userFind});
            }else{
                return res.status(404).send({message:'No hay usuarios logeados'});
            }
        })
    }
}

//---------------------------------------


//Funciones para administrador de hotel


//---------------------------------------

module.exports = {
    prueba,
    signIn,
    adminInit,
    logIn,
    listUser
}
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

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar esta cuenta'});
    }else{
        if(update.password){
            return res.status(404).send({message:'No se puede actualizar la password'});
        }else{
            if(update.username){
                User.findOne({username: update.username.toLowerCase()}, (err, userFind) => {
                    if(err){
                        return res.status(500).send({message:'Error al buscar usuario'});
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de usuario ya en uso'});
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate) => {
                            if(err){
                                return res.status(500).send({message:'Error al intentar actualizar'});
                            }else if(userUpdate){
                                return res.send({message:'Usuario actualizado', userUpdate});
                            }else{
                                return res.status(500).send({message:'No se puede actualizar'});
                            }
                        });                
                    }
                })
            }else if(update.rol){
                return res.status(404).send({message: 'No puedes actualizar tu rol'});
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate) => {
                    if(err){
                        return res.status(500).send({message:'Error al intentar actualizar'});
                    }else if(userUpdate){
                        return res.send({message:'Usuario actualizado', userUpdate});
                    }else{
                        return res.status(500).send({message:'No se puede actualizar'});
                    }
                })
            }
        }
    }        
}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message:'No tienes permiso para eliminar'});
    }else{
        User.findOne({_id: userId}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar usuario'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPas) => {
                    if(err){
                        return res.status(500).send({message:'Error al buscar password, no olvides colocar la contraseña'});
                    }else if(checkPas){
                        User.findByIdAndRemove(userId, (err, userRemoved) => {
                            if(err){
                                return res.status(500).send({message:'Error al buscar usuario'});
                            }else if(userRemoved){
                                return res.send({message: 'Usuario eliminado', userRemoved});
                            }else{
                                return res.status(404).send({message:'No se pudo eliminar al usuario o ya no fue eliminado'});
                            }
                        })
                    }else{
                        return res.status(500).send({message:'Password incorrecta'});
                    }
                })
            }else{
                return res.status(404).send({message:'El usuario no existe'});
            }
        })        
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

function creatUserAdmin_Hotel(req, res){
    var userId = req.params.id;
    var user = new User();
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para realizar esta accion'});
    }else{
        if(params.name && params.lastname && params.username && params.phone && params.email && params.password && params.passwordAdmin){
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
                            User.findOne({_id: userId}, (err, userFind) => {
                                if(err){
                                    return res.status(500).send({message:'Error al buscar usuario'});
                                }else if(userFind){
                                    bcrypt.compare(params.passwordAdmin, userFind.password, (err, checkPas) => {
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar password, no olvides colocar la contraseña'});
                                        }else if(checkPas){
                                            user.password = passwordHash;
                                            user.name = params.name;
                                            user.lastname = params.lastname;
                                            user.username = params.username.toLowerCase();
                                            user.rol = "ADMIN_HOTEL";
                                            user.phone = params.phone; 
                                            user.email = params.email;
                
                                            user.save((err, userSaved) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al intentar guardar'});
                                                }else if(userSaved){
                                                    return res.send({message:'Se ha creado exitosamente el administrador del hotel', userSaved});
                                                }else{
                                                    return res.status(401).send({message:'No se guardo el administrador del hotel'});
                                                }
                                            })
                                        }else{
                                            return res.status(500).send({message:'Password incorrecta'});
                                        }
                                    })
                                }else{
                                    return res.status(404).send({message:'El usuario no existe'});
                                }
                            })
                        }else{
                            return res.status(401).send({message:'Password no encriptada'});
                        }
                    })
                }
            })
        }else{
            return res.send({message:'Ingresa todos los parametros minimos, no olvides colocar la password del admin >passwordAdmin<'});
        }
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
    listUser,
    updateUser,
    removeUser,
    creatUserAdmin_Hotel
}
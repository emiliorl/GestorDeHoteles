'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

<<<<<<< HEAD
api.get('/prueba', userController.prueba);
api.post('/signIn', userController.signIn);
api.post('/logIn', userController.logIn);
=======
//funciones para cualquier tipo de user
api.get('/prueba', userController.prueba);
api.post('/signIn', userController.signIn);
api.post('/logIn', userController.logIn);
api.put('/updateUser/:id', [mdAuth.ensureAuth], userController.updateUser);
api.put('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser);
api.post('/createAdmin_Hotel/:id', [mdAuth.ensureAuth, mdAuth.validRolAdminOrAdminHotel], userController.creatUserAdmin_Hotel);

//funciones de admministrador
>>>>>>> 52bfa48e28fccd776bd4caad0801657624c8c431
api.get('/listUsers/:id', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser);

module.exports = api;
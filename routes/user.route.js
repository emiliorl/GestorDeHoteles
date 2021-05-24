'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middleware/authenticated');
<<<<<<< HEAD

var api = express.Router();

<<<<<<< HEAD
<<<<<<< HEAD
api.get('/prueba', userController.prueba);
api.post('/signIn', userController.signIn);
api.post('/logIn', userController.logIn);
=======
=======
api.get('/prueba', userController.prueba);
api.post('/signIn', userController.signIn);
api.post('/logIn', userController.logIn);
api.get('/listUsers/:id', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser);
=======
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

>>>>>>> dev
//funciones para cualquier tipo de user

api.get('/prueba', userController.prueba); //YA
api.post('/signUp', userController.signUp); // YA
api.post('/login', userController.login); //YA 
api.put('/updateUser/:id', [mdAuth.ensureAuth], userController.updateUser); //YA
api.put('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser); //YA
api.post('/createAdminHotel/:id', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.creatUserAdmin_Hotel); //YA
api.put('/:id/uploadImage', [mdAuth.ensureAuth, upload], userController.uploadImage); //YA
api.get('/getImage/:fileName', [upload], userController.getImage);// N/A

//funciones de admministrador
<<<<<<< HEAD
>>>>>>> 52bfa48e28fccd776bd4caad0801657624c8c431
api.get('/listUsers/:id', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser);
=======
api.get('/listUsers', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser);// YA
>>>>>>> 3200ac53c28e943d54ee57130165d1da68ddee22
>>>>>>> dev

module.exports = api;
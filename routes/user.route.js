'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middleware/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

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
api.get('/listUsers', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser);// YA

module.exports = api;
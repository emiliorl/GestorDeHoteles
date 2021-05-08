'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.get('/prueba', userController.prueba);
api.post('/signIn', userController.signIn);
api.post('/logIn', userController.logIn);
api.get('/listUsers/:id', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser);

module.exports = api;
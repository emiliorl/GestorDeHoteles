'use strict'

var mongoose = require('mongoose');
var app = require('./App')
var port = 3200;
<<<<<<< HEAD
=======
var adminInit = require('./controllers/user.controller')
>>>>>>> ae7666c (se completa la estructura, se crea el jwt y authorizated, modificacion en app, se comienza a trabajar con usuario)

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/GestorDeHoteles', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
<<<<<<< HEAD
        console.log('El servidor de Node JS esta funcionando')
=======
        console.log('El servidor de Node JS esta funcionando');
        adminInit.adminInit();
>>>>>>> ae7666c (se completa la estructura, se crea el jwt y authorizated, modificacion en app, se comienza a trabajar con usuario)
        app.listen(port, () => {
            console.log('Servidor de Express esta corriendo');
        })
    })
    .catch((err) => {
        console.log('Error al conecctar la BD', err)
    })
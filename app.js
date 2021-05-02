'use strict'

var express = require('express');
var bodyParser =  require('body-parser');
<<<<<<< HEAD
var userRoutes = require('./routes/user.route');
var companyRoutes = require('./routes/company.route')
var employeeRoutes = require('./routes/employee.route');
=======
var userRoute = require('./routes/user.route');
>>>>>>> ae7666c (se completa la estructura, se crea el jwt y authorizated, modificacion en app, se comienza a trabajar con usuario)

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

<<<<<<< HEAD
app.use('/api', userRoutes);
app.use('/api', companyRoutes);
app.use('/api', employeeRoutes)
=======
app.use('/v1', userRoute);
>>>>>>> ae7666c (se completa la estructura, se crea el jwt y authorizated, modificacion en app, se comienza a trabajar con usuario)

module.exports = app;
var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/bafaMvc');

//CRUD de la API
router.route('/users')

	// Agregar user
	.post(function(req, res, next){
		userCtrl.createUser(req.body, function(err, status){
			if(err){
				throw err;
			}
			res.send('usuario guardado');
		});	
	})

	// Buscar user
	.get(function(req, res, next){
		res.send('creo usuario /get dentro de la API');
	})

	// Editar User
	.put(function(req, res, next){
		res.send('update usuario /put dentro de la API');
	})

	// Borrar user
	.delete(function(req, res, next){
		res.send('borro usuario /delete dentro de la API');
	});

module.exports = router;
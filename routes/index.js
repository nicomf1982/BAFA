var express = require('express');
var router = express.Router();
var ctrlIndex = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res, next) {

	console.log(req.originalUrl);

	ctrlIndex.home({}, function(data){
		  res.render('home', data.title);
	});

});


/* GET login. */
router.get('/login', function(req, res, next) {

	 console.log(req.originalUrl);

});


/* POST login. */
router.post('/login', function(req, res, next) {

  console.log(req.body);
  
  if(req.body.name==='nicolas'){ res.send(true);}
  else{
  res.send (false);}

});


/* GET Registro. */
router.get ('/register', function(req, res, next){

	console.log(req.originalUrl);

	ctrlIndex.registerForm({}, function(data){
			res.render ('register', data.title);
	});

});


/* POST Registro. */
router.post ('/register', function(req, res, next){

	console.log(req.originalUrl);
	//validacion de datos en el servidor
	ctrlIndex.registerNewUser (req.body, function(err, data){
			res.send(data);	
	});

});


/* GET About. */
router.get ('/about', function(req, res, next){

	console.log(req.originalUrl);

	ctrlIndex.about ({}, function(data){
			res.render('about', data.title);
	});

});


/* GET Contacto. */
router.get ('/contact', function(req, res, next){

	console.log(req.originalUrl);

	ctrlIndex.contact({}, function(data){
		res.render('contact', data.title);
	});

});


/* POST Contacto. */
router.post ('/contact', function(req, res, next){

	console.log(req.originalUrl);
	res.send(true);

});

/* GET Forgot. */
router.get ('/forgot', function(req, res, next){

	ctrlIndex.forgot({}, function(data){
		res.render('forgot', data.title);
	});

});


// whiteList - must be at the top of routes to work
router.all('*', function(req,res,next){
  if (req.path === '/' ||
      req.path === '/login' ||
      req.path === '/register' ||
      req.path === '/contact' ||
      req.path === '/about') {
    next();
  } else console.log('no');
});
 
module.exports = router;

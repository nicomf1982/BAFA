var express = require('express');
var router = express.Router();
var ctrlIndex = require('../controllers/index')();
var registerConfirmation = require('../config.js').REGISTER_CONFIRMATION;
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {

	console.log(req.originalUrl);

	ctrlIndex.home({}, function(cmd){
			cmd.loginError =  req.flash("error");
			console.log(cmd);	
		  res.render('home', cmd);
	});

});


/* GET login. */
router.get('/login', function (req, res, next) {

	console.log(req.originalUrl);
	//console.log('esto es el user'+req.user);
	res.redirect ('/');

});


/* POST login. */
router.post('/login', function (req, res, next) {
	params = {
		email:req.body.email, 
		password:req.body.password
	};
	passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.json({status:false, message: 'Wrong username or password'}); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.json({status:true, message: 'Login Succes!'});
	    });
	  })(req, res, next);
});

/* GET Logout. */
router.get ('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/');
});

/* GET Registro. */
router.get ('/register', function (req, res, next){

	console.log(req.originalUrl);

	ctrlIndex.registerForm({}, function(data){
			res.render ('register', data.title);
	});

});


/* POST Registro. */
router.post ('/register', function (req, res, next){

	console.log(req.originalUrl);
	//validacion de datos en el servidor
	var baseURL= req.protocol + '://' + req.get('host');
	var params={ bodyPost: req.body, baseURL: baseURL};

	ctrlIndex.registerNewUser (params, function(err, data){
			res.send(data);	
	});

});


/* GET About. */
router.get ('/about', function (req, res, next){

	console.log(req.originalUrl);

	ctrlIndex.about ({}, function (data){
			res.render('about', data.title);
	});

});


/* GET Contacto. */
router.get ('/contact', function (req, res, next){

	console.log(req.originalUrl);

	ctrlIndex.contact({}, function(data){
		res.render('contact', data.title);
	});

});


/* POST Contacto. */
router.post ('/contact', function (req, res, next){

	console.log(req.originalUrl);
	res.send(true);

});

/* GET Forgot. */
router.get ('/forgot', function (req, res, next){

	ctrlIndex.forgot({}, function(data){
		res.render('forgot', data.title);
	});

});

/* GET Activation. */
router.get ('/activation', function (req, res, next) {
		if (registerConfirmation){
			var baseURL= req.protocol + '://' + req.get('host');
			var params={ bodyGet: req.query, baseURL:baseURL};
			ctrlIndex.checkActivationCode (params,function (data){
				if (data) {
				res.redirect('/');
				}else { res.send ('no hay coincidencia');}
			});
	}else {
		res.redirect('/');
	}
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

'use strict';

function Router (main){
  const app = main.app;
  const controllers = main.controllers;
  const registerConfirmation = main.config.get ('options.REGISTER_CONFIRMATION');

  return function (req, res, next) {

    /* GET home page. */
    app.get('/', (req, res, next) => {
      controllers.home().then((cmd) => {
        res.render('home', cmd)
      })
    });

    /* GET About. */
    app.get('/about', (req, res, next) => {
      controllers.about().then ((cmd) => {
        res.render('about', cmd);
      })
    });

    /* GET login. */
    app.get('/login', (req, res, next) => {
      controllers.login.login_get().then (() => {
        res.redirect('/');
      });
    });

    /* POST login. */
    app.post('/login', (req, res, next) => {
      const loginData = {
        email:req.body.email,
        password:req.body.password
      }
      controller.login.login_post(loginData).then(() => {

      })
    })

    /* GET Forgot. */
    app.get ('/forgot', (req, res, next) => {
      controllers.forgot().then((cmd) => {
        res.render('forgot', cmd.title);
      })
    });

    /* GET Register. */
    app.get ('/register', (req, res, next) => {
      const cmd = {
    		title: {title: 'Register'},
        message: []
    	};
      controllers.register.register_get().then (() => {
        res.render ('register', { title:cmd.title });
      })
    });

    app.post ('/register', (req, res, next) => {
      const registerData = {
        'bodyPost': req.body,
        'baseURL': req.protocol + '://' + req.get('host'),
      };
      controllers.user.registerNewUser(registerData)
      .then ((username) => {
        res.send({ username: username, message:[] });
      })
      .catch((e) => {
        res.send({ message:e })
      })
    })

    /* GET Contact. */
    app.get ('/contact', (req, res, next) => {
      controllers.contact.contact_get().then ((cmd) => {
        res.render('contact', cmd.title);
      })
    });

    /* POST Contacto. */
    app.post ('/contact', (req, res, next) => {
      controllers.contact.contact_post().then (() => {
        res.send (true);
      })
    })

    /* GET Logout. */
    app.get ('/logout', (req, res, next) => {
      // req.logout(); // Viene de passport
      res.redirect('/');
    })

    /* GET Activation. */
    app.get ('/activation', (req, res, next) => {
      if(registerConfirmation) {
        const baseURL = req.protocol + '://' + req.get('host');
        const params = {
          bodyGet: req.query,
          baseURL:baseURL,
        };
        controllers.user.activation(params).then((confirmation) => {
          if(confirmation) {
            res.redirect('/');
          } else res.send ('Error, please register again');
        })
      } else res.redirect ('/');
    })

    // whiteList - must be at the top of routes to work
    app.all('*', (req, res, next) => {
      if (req.path === '/' ||
          req.path === '/login' ||
          req.path === '/register' ||
          req.path === '/contact' ||
          req.path === '/about') {
        next();
      } else console.log('no');
    });

    // app.post('/login', main.controllers.login_post)
    // app.post ('/register', main.controllers.)


    next();
  };
};

module.exports = Router;



// var express = require('express');
// var router = express.Router();
// var ctrlIndex = require('../controllers/index')();
// var registerConfirmation = require('../config.js').REGISTER_CONFIRMATION;
// var passport = require('passport');
//


//
//
// /* POST login. */
// router.post('/login', function (req, res, next) {
// 	params = {
// 		email:req.body.email,
// 		password:req.body.password
// 	};
// 	passport.authenticate('local', function(err, user, info) {
// 	    if (err) { return next(err); }
// 	    if (!user) { return res.json({status:false, message: 'Wrong username or password'}); }
// 	    req.logIn(user, function(err) {
// 	      if (err) { return next(err); }
// 	      return res.json({status:true, message: 'Login Succes!'});
// 	    });
// 	  })(req, res, next);
// });
//


//
//
// /* POST Registro. */
// router.post ('/register', function (req, res, next){
//
// 	console.log(req.originalUrl);
// 	//validacion de datos en el servidor
// 	var baseURL= req.protocol + '://' + req.get('host');
// 	var params={ bodyPost: req.body, baseURL: baseURL};
//
// 	ctrlIndex.registerNewUser (params, function(err, data){
// 			res.send(data);
// 	});
//
// });
//

const express = require('express');
const debug = require ('debug')('App');
const mongojs = require ('mongojs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require ('http');
const session = require('express-session');
// const passport = require('passport');
// const flash = require('connect-flash');

// const LocalStrategy = require('passport-local').Strategy;
// const RememberMeStrategy = require('passport-remember-me')
// const RememberMeStrategy = require('../..').Strategy;
// var userModel  = require ('./model/users.js')();
// var indexRoutes = require('./routes/index');


// var app = express();

function app(config){
  debug('main app...')
  const self = this;
  self.main = {
    'config' : config,
  }

  return new Promise(function(resolve, reject) {
    self.mongoDb()
    .then (() => {
      return self.getApp()
    })
    .then (() => {
      return self.models()
    })
    .then (() => {
      return self.libs()
    })
    .then (() => {
      return self.controllers()
    })
    .then (() => {
      return self.account()
    })
    .then (() => {
      return self.routes()
    })
    .then (() => {
      resolve(self.main);
    })
    .catch ((e) => {
      console.log(e);
    })
  });
}

app.prototype.mongoDb = function () {
  debug('MongoDB...')
  const self = this;

  return new Promise(function(resolve, reject) {
    self.main.db = mongojs(self.main.config.get('db.host'), self.main.config.get('db.collections'))

    self.main.db.on('error', function (err) {
    console.log('database error', err)
    })

    self.main.db.on('connect', function () {
        console.log('database connected')
    })

    resolve({ mongojs: self.main.db });
  });
}

app.prototype.getApp = function () {
  debug('Express Middlewares...')
  const self = this;

  return new Promise(function(resolve, reject) {
    self.main.app = express();
    self.main.server = http.createServer(self.main.app);
    self.main.app.set('views', path.join(__dirname, 'views'));
    self.main.app.set('view engine', 'ejs');
    // uncomment after placing your favicon in /public
    //self.main.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    self.main.app.use(logger('dev'));
    self.main.app.use(bodyParser.json());
    self.main.app.use(bodyParser.urlencoded({ extended: false }));
    self.main.app.use(cookieParser());
    self.main.app.use(express.static(path.join(__dirname, 'public')));
    self.main.app.use(session(self.main.config.get('session')));
    // self.main.app.use(flash());

    resolve();
  });
}

app.prototype.models = function () {
  debug('Models...')
  const self = this;

  return new Promise(function(resolve, reject) {
    self.main.model = require('./model')(self.main);
    resolve({ model: self.main.model });
  });
}

app.prototype.libs = function (){
  debug('Libs...')
  const self = this;

  return new Promise(function(resolve, reject) {
    self.main.libs = {}
    self.main.libs = require('./lib')(self.main);
    resolve({ libs: self.main. libs });
  });
}

app.prototype.controllers = function () {
  debug('Controllers...')
  const self = this;

  return new Promise(function(resolve, reject) {
    self.main.controllers = require('./controllers')(self.main);
    resolve({ controllers: self.main.controllers });
  });
}

app.prototype.account = function () {
  debug('Passport...')
  const self = this;
  return new Promise(function(resolve, reject) {
    self.main.passport = require('passport');
    self.main.account = require('./lib/account')
    self.main.app.use(self.main.passport.initialize());
    self.main.app.use(self.main.passport.session());
    self.main.account.Account(self.main)
    self.main.app.use  ((req, res, next) => {
      req.app.locals.loggedUser = req.user;
      next();
    });
    resolve();
  });
}

app.prototype.routes = function () {
  debug('Routes...')
  const self = this

  return new Promise(function(resolve, reject) {
    self.main.app.use(require ('./routes')(self.main));

    resolve({ routes: self.main.routes });
  });
}
        // // mongoose
        // var mongoose = require('mongoose');
        // var mongoUrl = require('./config.js').db;
        // mongoose.connect(mongoUrl);
        //
        // var db = mongoose.connection;
        // db.on('error', console.error.bind(console, 'connection error:'));
        // db.once('open', function() {
        //   console.log("Mongo connection READY!");
        // });
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// // Express-Sessions
// app.use(session({
//     secret: 'keyboard cat',
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000*60*60*24*7}, // a week
// }));
//
// // Passport
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
// userModel.passportStrategies(passport);
//
// // settings default
// app.use  (function (req, res, next){
//
//   console.log (req.get('host'));
//   req.app.locals.loggedUser = req.user;
//   next();
// });
//
// app.use('/', indexRoutes);
//
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;

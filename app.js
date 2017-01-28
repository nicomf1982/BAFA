const express = require('express');
const debug = require('debug')('App');
const mongojs = require('mongojs');
const path = require('path');
const favicon = require('serve-favicon');
const ip = require("ip");
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const session = require('express-session');
const RedisStore = require('connect-redis')(session)
const helmet = require('helmet');
const multer = require('multer');
const i18n = require("i18n");
const nodemailer = require('nodemailer');
// const redis = require('redis');
// const client = redis.createClient();

// const passport = require('passport');
// const flash = require('connect-flash');

function app(config) {
  debug('main app...');
  const self = this;
  self.main = {
    config: config,
    protocol: config.get('server.protocol'),
    domain: config.get('server.domain') || ip.address(),
    port: config.get('server.port')
  };

  return new Promise(function (resolve, reject) {
    self.mongoDb()
    .then(() => {
      return self.getApp();
    })
    .then(() => {
      return self.models();
    })
    .then(() => {
      return self.libs();
    })
    .then(() => {
      return self.controllers();
    })
    .then(() => {
      return self.routes();
    })
    .then(() => {
      resolve(self.main);
    })
    .catch((e) => {
      console.log(e);
    });
  });
}

app.prototype.mongoDb = function () {
  debug('MongoDB...');
  const self = this;

  return new Promise(function (resolve, reject) {
    self.main.db = mongojs(self.main.config.get('db.host'), self.main.config.get('db.collections'));

    self.main.db.on('error', (err) => {
      console.log('database error', err);
    });

    // self.main.db.on('connect', () => {
    //   console.log('database connected');
    // });

    resolve({ mongojs: self.main.db });
  });
};

app.prototype.getApp = function () {
  debug('Express Middlewares...');
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.app = express();
    self.main.server = http.createServer(self.main.app);
    self.main.app.set('views', path.join(__dirname, 'views'));
    self.main.app.set('view engine', 'ejs');
    // uncomment after placing your favicon in /public
    // self.main.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    self.main.app.use(logger('dev'));
    self.main.app.use(bodyParser.json());
    self.main.app.use(bodyParser.urlencoded({ extended: false }));
    self.main.app.use(cookieParser());
    self.main.app.use(express.static(path.join(__dirname, 'public')));
    self.main.upload = multer({ dest: './public/avatar' });
    self.main.app.use(session(
      Object.defineProperty(self.main.config.get('session'), // Add property 'store' (whit redis conections params )to the session object
      'store', {
        // enumerable: true,
        // configurable: false,
        // writable: false,
        value: new RedisStore(self.main.config.get('redis')),
      })));
    self.main.app.use(helmet());
    // self.main.app.use(flash());

    resolve();
  });
};

app.prototype.models = function () {
  debug('Models...');
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.model = require('./model')(self.main);
    self.main.model.user.resetPassword();
    resolve({ model: self.main.model });
  });
}

app.prototype.libs = function () {
  debug('Libs...');
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.libs = {};
    self.main.passport = require('passport');
    self.main.libs = require('./lib')(self.main);
    self.main.app.use(self.main.passport.initialize());
    self.main.app.use(self.main.passport.session());
    self.main.app.use((req, res, next) => {
      req.app.locals.loggedUser = req.user;
      next();
    });
    resolve({ libs: self.main.libs });
  });
};

app.prototype.controllers = function () {
  debug('Controllers...');
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.controllers = require('./controllers')(self.main);
    resolve({ controllers: self.main.controllers });
  });
};

app.prototype.routes = function () {
  debug('Routes...');
  const self = this;

  return new Promise((resolve, reject) => {
    self.main.app.use('/', require ('./routes/web')(self.main));
    self.main.app.use('/user', require('./routes/user')(self.main));
    self.main.app.use('/api', require ('./routes/api.js')(self.main));

    // catch 404 and forward to error handler
    self.main.app.use((req, res, next) => {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // development error handler
    // will print stacktrace
    if (self.main.app.get('env') === 'development') {
      self.main.app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    self.main.app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

    resolve({ routes: self.main.routes });
  });
};

module.exports = app;

'use strict'

const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require ('connect-ensure-login')
module.exports = {
  Account: function (main) {
    const passport = main.passport;
    const user = main.model.user;

    passport.use(new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password'
    },(username, password, done) => {
      user.auth (username, password)
        .then ((user) => {
          user ? done(null, user) : done(null, false)
        })
        .catch ((err) => done(err))
      }
    ));

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      user.findById(id)
        .then ((user) => {
          done(null, user);
        })
        .catch ((err) => {
          done(err, null);
        })
    });

  },
  ensureLogged: function  (){
    return ensureLogin.ensureLoggedIn()
  }
}
// module.exports = Account;
// module.exports = ensureLogged;

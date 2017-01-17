'use strict'

function Account (passport) {
 return {

 }
}

module.exports = Account;


passportStrategies : function (passport) {
  var _this= this;

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    user.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    },
    function(username, password, done) {
        _this.auth( username, password , function (err, user) {
          console.log(user);
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          //if (!user.verifyPassword(password)) { return done(null, false); }
          return done(null, user);
        });
      }
  ));
},

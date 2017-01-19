'use strict';

function Login (main) {
  // const passport = main.passport;
  return {

    login_get: function login_get () {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    },

    login_post: function login_post (loginData) {
      return new Promise(function(resolve, reject) {
          resolve()
      });
    }

  };
}

module.exports = Login;

// /* GET login. */
// router.get('/login', function (req, res, next) {
//
// 	console.log(req.originalUrl);
// 	//console.log('esto es el user'+req.user);
// 	res.redirect ('/');
//
// });
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

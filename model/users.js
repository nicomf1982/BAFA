//	 MODELO - CONTROL Y MANEJO DE LOS DATOS EN LA DB

var crypto = require('crypto');
var uuid = require('uuid');
var user = require('./schemas/users.js');
var mongoose = require("mongoose");
var LocalStrategy = require('passport-local').Strategy;

function Users () {

	var cryptoSecret = require('../config.js').cryptoSecret;

	return {

		createUserLocal : function (newUser, cb){

			var uniqueUUID = uuid.v4();
			var cryptopass = crypto.createHash('sha256', cryptoSecret).update(newUser.password1).digest('hex');
			var activationHash = crypto.randomBytes(64).toString('hex');
 			//var newId = mongoose.Types.ObjectId(uniqueUUID);
 			//console.log (newId);

			createUser = user({
				'id':    		uniqueUUID,
				'provider': 	'local',
				'creationDate': new Date(),
				'enable': 		false,
				'activationHash':activationHash,
				'displayName': 	newUser.alias, 
				'name': 		{familyName: '', middleName: '', givenName: newUser.alias},
				'username': 	newUser.email,
				'email': 		newUser.email,
				'pass': 		cryptopass,
				'legals':  		newUser.legals,
			});
			createUser.save (function (err, storedUser){
				if (err) {
					throw err;
				}
				cb(null, storedUser);
			});
		},


		existUserLocal : function (newUser, cb){
			//console.log (data);
			user.findOne({ $or: [ {displayName: newUser.alias} ,{email: newUser.email} ] ,provider: "local"}, function (err,data){
				if(err){
					throw new Error(err);
				}else{
					cb(null,data);
				}
			});
		},

		existActivationHash : function(username, cb){
			//console.log (data);
			user.findOne({ username: username }, function (err, data){
				if (err){
					throw err;
				}
				cb(null, data);
			});
		},

		activateAccount : function (userID, cb){
			console.log (userID);
			user.findByIdAndUpdate(userID, { $set: { enable: true }}, function (err, data) {
  				if (err){
  					throw err;
  				}
  				cb(null, data);
			});
		},

		updateUser : function (data, cb){
			//db.users.
		},

		deleteUser : function (data, cb){
			//db.users.remove({},function (){})
		},

		auth : function (username, password, cb){
			var cryptopass = crypto.createHash('sha256', cryptoSecret).update(password).digest('hex');							
			user.findOne({ email: username, pass:cryptopass, enable: true }, function (err, user) {
				cb(err, user);
			});
		},

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
	};
}

module.exports = Users;

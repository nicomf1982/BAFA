//	 MODELO - CONTROL Y MANEJO DE LOS DATOS EN LA DB

var crypto = require('crypto');
var uuid = require('uuid');
var user = require('./schemas/users.js');
var mongoose = require("mongoose");

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
	};
}

module.exports = Users;

//	 MODELO - CONTROL Y MANEJO DE LOS DATOS EN LA DB

var crypto = require('crypto');
var db = require('../config.js').db;
var cryptoSecret = require('../config.js').cryptoSecret;



exports.createUserLocal = function (data, cb){

	var cryptopass = crypto.createHash('sha256', cryptoSecret).update(data.password1).digest('hex');

	db.users.insert({
		'alias': 	data.alias,
		'email': 	data.email,
		'pass': 	cryptopass,
		'legals':   data.legals,
	}, function(err, data){
		if (err) {
			throw err;
		}
		cb(null, true);
	});
};


exports.existUserLocal = function (data, cb){
	//console.log (data);
	db.users.findOne({ $or: [ {alias: data.alias} ,{email: data.email} ] }, function(err,data){
		if(err){
			throw new Error(err);
		}else{
			cb(null,data);
		}
	});
};



exports.updateUser = function (data, cb){
	//db.users.

};

exports.deleteUser = function (data, cb){
	//db.users.remove({},function (){})
};

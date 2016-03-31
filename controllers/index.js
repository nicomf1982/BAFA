//CONTROLADOR - RECIVE LOS DATOS Y VE QUE HACER CON ELLOS (logica de negocio)

// Validator para validar y sanizar el registro del lado del servidor 
var validator = require('validator');
var userModel  = require ('../model/users.js');

// Estructura para devolver datos a la vista
exports.home = function(params, cb){
	var data = {
		title: {title:'BAFA'}
	};
	cb(data);
};

exports.about = function(params, cb) {
	var data = {
		title: {title: 'about this'},
	};
	cb(data);
};


exports.contact = function (params, cb){
	var data = {
		title: {title:'contact'}
	};
	cb(data);
};

exports.registerForm = function (params, cb){
	var data = {
		title:{title:'Register'}
	};
	cb(data);
};

exports.registerNewUser = function(params, cb){

	// Variable info para manejar los errores y el pass-thru de crear usuarios
	var info = {
		'msg':[],
		'status': true
	};

	var newUser = {

		// Escapar a los tags HTML, y trim() para recortar los espacios adelante y atras
		alias: validator.escape(params.alias.trim()),
		email: validator.escape(params.email.trim()),
		password1: params.password1,
		password2:params.password2,
		legals: true,
	};


	if(newUser.alias.length ===0 || newUser.alias.length <3 || newUser.alias.length > 40){
		info.msg.push('Check criteria Username');
		info.status = false;
	}else {
		// Normalizamos el Alias todo en minuscula, asi evitamos alias similares con mayusculas
		newUser.alias = newUser.alias.toLowerCase();
	}

	if(!validator.isEmail(newUser.email)){
		info.msg.push('Use a valid Email');
		info.status = false;
	}else{
		// normalizamos el Email, lowercase, quitamos los puntos, etc
		newUser.email = validator.normalizeEmail(newUser.email,{ lowercase: true, remove_dots: true, remove_extension: true });
	}	

	if(newUser.password1 !== newUser.password2){
		info.msg.push('The passwords must be equal');
		info.status = false;
	}

	if (newUser.password1.length < 8) {
		info.msg.push('The password needs to be 8 characters at least');
		info.status = false;
	}


	if(info.status){

		console.log(newUser);
		// Preguntamos si ya hay algun usuario en la DB con el usuario y mail	
		userModel.existUserLocal(newUser, function(err,data){
			if(data){
				if (data.alias === newUser.alias){
					info.msg.push('Nombre de usuario ya existente');
					cb(null, info);
				}
				else if (data.email === newUser.email){ 
					info.msg.push('Email ya registrado');
					cb(null, info);
				}
			}else{
				// En caso de que ambos sean unicos, guardamos el usuario completo (newUser) en la DB
				userModel.createUserLocal  (newUser, function(err, data){
					info.msg.push('El usuario ha sido creado satisfactoriamente');
					cb(null, info);//usuario creado
				});	
			}
		});
	}else {
		// Si algun campo falla en la comprobacion , info.msg pasa a ser false e indica los errores
		for (var i = info.msg.length - 1; i >= 0; i--) {
			console.log (info.msg[i]);
		}
		info.msg.push('El usuario no ha podido ser creado, comprueve los requisitos');
		cb(null, info);
	}

};

exports.forgot = function (param, cb){
	var data = {
		title: {title:'forgot'}
	};
	cb(data);
};





//CONTROLADOR - RECIVE LOS DATOS Y VE QUE HACER CON ELLOS (logica de negocio)

// Validator para validar y sanizar el registro del lado del servidor 
var validator = require('validator');
var userModel  = require ('../model/users.js')();
var email = require("../lib/email.js")();
var registerConfirmation = require('../config.js').REGISTER_CONFIRMATION;
// Estructura para devolver datos a la vista

function Home() {

	return {

		home : function(params, cb){
			var cmd = {
				title: {title:'BAFA'}
			};
			cb(cmd);
		},

		about : function(params, cb) {
			var cmd = {
				title: {title: 'about this'},
			};
			cb(cmd);
		},

		contact : function (params, cb){
			var cmd = {
				title: {title:'contact'}
			};
			cb(cmd);
		},

		registerForm : function (params, cb){
			var cmd = {
				title:{title:'Register'}
			};
			cb(cmd);
		},

		registerNewUser : function(params, cb){
			// Variable info para manejar los errores y el pass-thru de crear usuarios
			var cmd = {
				'title':'Register User',
				'msg':[],
				'status': true
			};

			var newUser = {

				// Escapar a los tags HTML, y trim() para recortar los espacios adelante y atras
				alias: validator.escape(params.bodyPost.alias.trim()),
				email: validator.escape(params.bodyPost.email.trim()),
				password1: params.bodyPost.password1,
				password2:params.bodyPost.password2,
				legals: true,
			};


			if(newUser.alias.length ===0 || newUser.alias.length <3 || newUser.alias.length > 40){
				cmd.msg.push('Check criteria Username');
				cmd.status = false;
			}else {
				// Normalizamos el Alias todo en minuscula, asi evitamos alias similares con mayusculas
				newUser.alias = newUser.alias.toLowerCase();
			}

			if(!validator.isEmail(newUser.email)){
				cmd.msg.push('Use a valid Email');
				cmd.status = false;
			}else{
				// normalizamos el Email, lowercase, quitamos los puntos, etc
				newUser.email = validator.normalizeEmail(newUser.email,{ lowercase: true, remove_dots: true, remove_extension: true });
			}	

			if(newUser.password1 !== newUser.password2){
				cmd.msg.push('The passwords must be equal');
				cmd.status = false;
			}

			if (newUser.password1.length < 8) {
				cmd.msg.push('The password needs to be 8 characters at least');
				cmd.status = false;
			}

			if(cmd.status){

				// Preguntamos si ya hay algun registro en la DB con el usuario y mail	
				userModel.existUserLocal(newUser, function(err,data){
					if (err){
						throw err;
					}
					if(data){
						if (data.displayName === newUser.alias){
							cmd.msg.push('Nombre de usuario ya existente');
							cb(null, cmd);
						}
						else if (data.email === newUser.email){ 
							cmd.msg.push('Email ya registrado');
							cb(null, cmd);
						}
					}else{
						// En caso de que ambos sean unicos, guardamos el usuario completo (newUser) en la DB
						userModel.createUserLocal  (newUser, function (err, storedUser){
							cmd.msg.push('El usuario ha sido creado satisfactoriamente');
							// Enviamos el mail de registro
							email.sendRegister ({
								registerConfirmation:registerConfirmation,
								email:storedUser.email,
								activationHash:storedUser.activationHash,
								displayName:storedUser.displayName,
								baseURL:params.baseURL,
							 }, function(data){
							});
							cb(null, cmd);//usuario creado
						});	
					}
				});
			}else {
				// Si algun campo falla en la comprobacion , cmd.msg pasa a ser false e indica los errores
				for (var i = cmd.msg.length - 1; i >= 0; i--) {
					console.log (cmd.msg[i]);
				}
				cmd.msg.push('El usuario no ha podido ser creado, compruebe los requisitos');
				cb(null, cmd);
			}
		},

		checkActivationCode : function (params, cb){
			var cmd = {
				title: 'Account activation', 
				msg: [],
				status: true,
			};
			var activationHash;
			var username;

			if(!('email' in params.bodyGet) || !('activationHash' in params.bodyGet)) {
				cmd.msg.push('se produjo un error');
				cmd.status=false;
				cb(cmd);
				return;
			}else {
				activationHash = validator.escape(params.bodyGet.activationHash.trim());
				username = validator.escape(params.bodyGet.email.trim());				
			}

			userModel.existActivationHash (username, function (err, userData){

				console.log(userData);
				if (err) {
					throw err;
				}
				if (userData) {
					// fijo diferencia horaria entre creacion y fecha actual (en horas)					
					var difTime = (new Date() - userData.creationDate)/1000/60/60;					
					// verificamos que ambos hashes sean iguales
					if (userData.activationHash != activationHash){
						cmd.msg.push('error al activar la cuenta, intentelo nuevamente');
						cmd.status=false;
					}
					// Verificamos que ya no  halla sido activado anteriormente
					if (userData.enable===true){
						cmd.msg.push('usuario ya activado anteriormente');
						//cmd.status=false;
						cb(cmd);
						return;										
					}
					// Verificamos que el link no halla caducado
					if (difTime>72) {
						cmd.msg.push('el link ha caducado, registrese nuevamente');
						cmd.status=false;
						//borrar el usuario
						cb(cmd);
						return;
					}
					// si esta todo oks, llamar a la function activateUser
					if (cmd.status) {
						userModel.activateAccount(userData._id, function (err, data){
							if (err){
								throw err;
							}
							cmd.msg.push('usuario activado satisfactoriamente');
							cb (cmd);
							return;
						});
					}else {
						cb(cmd);
						return;
					}
				}else {
					cmd.msg.push('usuario invalido, imposible activar');
					cmd.status=false;
					cb(cmd);
				}
			});
		},

		forgot : function (param, cb){
			var data = {
				title: {title:'forgot'}
			};
			cb(data);
		},

		login: function (param, cb) {
			var cmd = {
				'title':'login page',
				'msg':[],
				'status': true
			};
			cb(cmd);
		},
	};
}	

module.exports = Home;



'use strict'

function user (main){
  const model = main.model;
  const libs = main.libs;

  return {

    registerNewUser : function(registerData) {
      return new Promise(function(resolve, reject) {

        let newUser = {
          username: registerData.bodyPost.username,
          email: registerData.bodyPost.email,
          password1: registerData.bodyPost.password1,
          password2:registerData.bodyPost.password2,
          legals: true,
          error: [],
        };

        libs.userValidator(newUser)
          .then((validatedUser) => {
            if(!validatedUser.error.length){ // Si no hubo errores en la validacion
              model.user.find({$or: [{username: validatedUser.username}, {email: validatedUser.email}]})
                .then((docs) => {
                  if (docs.length) { // Si algun dato ya esta en la DB
                    docs.forEach((user) => {
                      if (user.username === validatedUser.username){
                        validatedUser.error.push('Username already exist');
                      }
                      if (user.email === validatedUser.email){
                        validatedUser.error.push('Email already exist');
                      }
                    })
                    reject(validatedUser.error); // mando las coincidencias
                  }else {
                  model.user.createLocal(validatedUser) // si no hay errores guardo el nuevo usuario
                    .then ((storedUser) => {
                      resolve(storedUser.username);
                    })
                  }
                })
              }else{
                reject (validatedUser.error);
              }
          })
          .catch ((e) => {
            reject(e);
          })
        });
      }
    }
  }
  module.exports = user;

          // userModel.existUserLocal(newUser, function(err,data){
          //   if (err){
          //     throw err;
          //   }
          //   if(data){
          //     if (data.displayName === newUser.username){
          //       cmd.msg.push('Username already exist');
          //       cmd.status = false;
          //       cb(null, cmd);
          //     }
          //     else if (data.email === newUser.email){
          //       cmd.msg.push('Email already exist');
          //       cmd.status = false;
          //       cb(null, cmd);
          //     }
          //   }else{
          //     // En caso de que ambos sean unicos, guardamos el usuario completo (newUser) en la DB
          //     userModel.createUserLocal  (newUser, function (err, storedUser){
          //       cmd.msg.push('El usuario ha sido creado satisfactoriamente');
        //         // Enviamos el mail de registro
        //         email.sendRegister ({
        //           registerConfirmation:registerConfirmation,
        //           email:storedUser.email,
        //           activationHash:storedUser.activationHash,
        //           displayName:storedUser.displayName,
        //           baseURL:params.baseURL,
        //          }, function(data){
        //         });
        //         cb(null, cmd);//usuario creado
        //       });
        //     }
        //   });
        // }else {
        //   // Si algun campo falla en la comprobacion , cmd.msg pasa a ser false e indica los errores
        //   for (var i = cmd.msg.length - 1; i >= 0; i--) {
        //     console.log (cmd.msg[i]);
        //   }
        //   cmd.msg.push('El usuario no ha podido ser creado, compruebe los requisitos');
        //   cb(null, cmd);
        // }

//
//
//
// 		checkActivationCode : function (params, cb){
// 			var cmd = {
// 				title: 'Account activation',
// 				msg: [],
// 				status: true,
// 			};
// 			var activationHash;
// 			var username;
//
// 			if(!('email' in params.bodyGet) || !('activationHash' in params.bodyGet)) {
// 				cmd.msg.push('se produjo un error');
// 				cmd.status=false;
// 				cb(cmd);
// 				return;
// 			}else {
// 				activationHash = validator.escape(params.bodyGet.activationHash.trim());
// 				username = validator.escape(params.bodyGet.email.trim());
// 			}
//
// 			userModel.existActivationHash (username, function (err, userData){
//
// 				console.log(userData);
// 				if (err) {
// 					throw err;
// 				}
// 				if (userData) {
// 					// fijo diferencia horaria entre creacion y fecha actual (en horas)
// 					var difTime = (new Date() - userData.creationDate)/1000/60/60;
// 					// verificamos que ambos hashes sean iguales
// 					if (userData.activationHash != activationHash){
// 						cmd.msg.push('error al activar la cuenta, intentelo nuevamente');
// 						cmd.status=false;
// 					}
// 					// Verificamos que ya no  halla sido activado anteriormente
// 					if (userData.enable===true){
// 						cmd.msg.push('usuario ya activado anteriormente');
// 						//cmd.status=false;
// 						cb(cmd);
// 						return;
// 					}
// 					// Verificamos que el link no halla caducado
// 					if (difTime>72) {
// 						cmd.msg.push('el link ha caducado, registrese nuevamente');
// 						cmd.status=false;
// 						//borrar el usuario
// 						cb(cmd);
// 						return;
// 					}
// 					// si esta todo oks, llamar a la function activateUser
// 					if (cmd.status) {
// 						userModel.activateAccount(userData._id, function (err, data){
// 							if (err){
// 								throw err;
// 							}
// 							cmd.msg.push('usuario activado satisfactoriamente');
// 							cb (cmd);
// 							return;
// 						});
// 					}else {
// 						cb(cmd);
// 						return;
// 					}
// 				}else {
// 					cmd.msg.push('usuario invalido, imposible activar');
// 					cmd.status=false;
// 					cb(cmd);
// 				}
// 			});
// 		},
//
// 		forgot : function (param, cb){
// 			var data = {
// 				title: {title:'forgot'}
// 			};
// 			cb(data);
// 		},
//
// 		login: function (param, cb) {
// 			var cmd = {
// 				'title':'login page',
// 				'msg':[],
// 				'status': true
// 			};
// 			cb(cmd);
// 		},
// 	};
// }

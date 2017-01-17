'use strict';

const validator = require('validator');

function validateUser (_newUser) {

  return new Promise(function(resolve, reject) {
    let newUser = _newUser;

    newUser = {
      username: validator.escape(newUser.username.trim()),
      email: validator.escape(newUser.email.trim()),
      password1: newUser.password1,
      password2:newUser.password2,
      legals: false,
      error: [],
    };

    if(newUser.username.length === 0 || newUser.username.length < 3 || newUser.username.length > 40){
      newUser.error.push('Check username length');
    }else {
      newUser.username = newUser.username.toLowerCase();
    }

    if(!validator.isEmail(newUser.email)){
      newUser.error.push('Use a valid Email');
    }else{
      newUser.email = validator.normalizeEmail(newUser.email,{ lowercase: true, remove_dots: true, remove_extension: true });
    }

    if(newUser.password1 !== newUser.password2){
      newUser.error.push('The passwords must be equal');
    }

    if (newUser.password1.length < 8) {
      newUser.error.push('The password needs to be 8 characters at least');
    }
    (newUser.error.length) ? reject(newUser.error) : resolve(newUser)
    // resolve(newUser);
  })
};

module.exports = validateUser;

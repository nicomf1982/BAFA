'use strict'

function Register(main) {

  return {
    register_get: function register_get(){
      return new Promise(function(resolve, reject) {
        resolve()
      });
    },
    register_post: function register_post() {
      return new Promise(function(resolve, reject) {
        resolve()
      });
    }

  }
}

module.exports = Register;

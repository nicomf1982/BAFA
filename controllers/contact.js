'use strict';

function contact (req, res) {
  const cmd = {
    title: {title: 'about this'},
  };
  return {
    contact_get : () => {
      return new Promise(function(resolve, reject) {
        resolve(cmd)
      });
    },
    contact_post : () => {
      return new Promise(function(resolve, reject) {
        // manda un mail a nuestra casilla con la consulta
        resolve()
      });
    }
  }
}

module.exports = contact;

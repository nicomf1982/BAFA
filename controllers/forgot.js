'use strict'

function forgot () {
  const cmd = {
    title: {title:'forgot'}
  }
  return new Promise(function(resolve, reject) {
    resolve(cmd);
  });

}
module.exports = forgot;

'use strict';

function home(){
  const cmd = {
    title: { title:'MVC'}
  };
  return new Promise(function(resolve, reject) {
    resolve(cmd);
  });
}
module.exports = home;

'use strict'

function Model(main) {
  return {
    user: require('./user')(main),
  };
}

module.exports = Model;

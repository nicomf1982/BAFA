'use strict';

function Libs (main) {
  return {
    userValidator : require ('./validator'),
    // account: require ('./account')(main),
  }
}

module.exports = Libs;

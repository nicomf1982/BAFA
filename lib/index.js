'use strict';

function Libs(main) {
  return {
    userValidator: require('./validator'),
    email: require('./email')(main),
    account: require('./account')(main),
    postValidator: require('./validator-node'),
  };
}

module.exports = Libs;

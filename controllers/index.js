'use sctrict'

function Controllers(main) {


  return{
    user: require('./user')(main),
    web: require('./web')(main),
  }
}

module.exports = Controllers;

'use strict'

function User (main) {

const crypto = require('crypto');
const cryptoSecret = main.config.get('crypto.key');
const db = main.db;

  return {

      createLocal: function createLocal (newUser) {
        return new Promise(function(resolve, reject) {
          let cryptopass = crypto.createHash('sha256', cryptoSecret).update(newUser.password1).digest('hex');
          let activationHash = crypto.randomBytes(64).toString('hex');
          const userLocal = {
            'provider': 'local',
            'creationDate': new Date(),
            'enable':false,
            'activationHash':activationHash,
            'username': newUser.username,
            'email': newUser.email,
            'pass':cryptopass,
            'legal': newUser.legals,
          }
          db.users.insert(userLocal, (err, doc) => {
            err ? reject(err) : resolve(doc);
          })
        });
      },

      find: function find (query) {
        return new Promise(function(resolve, reject) {
          db.users.find(query, (err, doc) => {
            err ? reject(err) : resolve (doc);
          })
        });
      },
      // delete:,
      // modify:,

  }
}
module.exports = User;

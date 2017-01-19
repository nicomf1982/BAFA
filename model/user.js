'use strict'

function User (main) {

const crypto = require('crypto');
const cryptoSecret = main.config.get('crypto.key');
const user = main.db.users;

  return {

      createLocal: function createLocal (newUser) {
        return new Promise((resolve, reject) => {
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
          user.insert(userLocal, (err, doc) => {
            err ? reject(err) : resolve(doc);
          })
        });
      },

      find: function find (query) {
        return new Promise((resolve, reject) => {
          user.find(query, (err, doc) => {
            err ? reject(err) : resolve (doc);
          })
        });
      },

      auth : function (email, password) {
        const self = this
        return new Promise((resolve, reject) => {
          self.cryptopass(password)
          .then((encryptedPass) => {
            return user.findOne({email:email, pass:encryptedPass}, (err, doc) => {
              err ? reject (err) : resolve (doc);
            })
          });
        });
      },

      cryptopass: function(password) {
        return new Promise((resolve, reject) => {
          const encryptedPass = crypto.createHash('sha256', cryptoSecret).update(password).digest('hex');
          resolve(encryptedPass);
        });
      },

      findById: function (id) {
        return new Promise((resolve, reject) => {
          user.findOne({_id: main.db.ObjectId(id)},{username:1, email:1,creationDate:1  }, (err, doc) => {
            err ? reject (err) : resolve (doc)
          })
        });
      }
      // verifyPass
      // delete:,
      // modify:,
      // findOne:,
      // verifyPassword:,
      // cryptopass
      // cryptohash
      // verifyPass
      // findById


  }
}
module.exports = User;

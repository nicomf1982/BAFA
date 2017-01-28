'use strict'
const crypto = require('crypto');

function User(main) {

  const cryptoSecret = main.config.get('crypto.key');
  const user = main.db.users;

  function cryptopass(password) {
    return new crypto.createHash('sha256', cryptoSecret).update(password).digest('hex');
  }

  // function token() {
  //   return new crypto.randomBytes(64).toString('hex');
  // }

  return {

    tokenGenerator : () => {
      return new crypto.randomBytes(32).toString('hex');
    },

    createLocal: function createLocal(newUser) {
      return new Promise((resolve, reject) => {
        const self = this;
        const userLocal = {
          provider: 'local',
          creationDate: new Date(),
          role: 3,
          enable: false,
          activationToken: self.tokenGenerator(),
          resetPasswordToken: undefined,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          gender: newUser.gender,
          birth: newUser.birth,
          username: newUser.username,
          email: newUser.email,
          password: cryptopass(newUser.password1),
          legal: newUser.legals,
          defaultAvatar: newUser.defaultAvatar,
          customAvatar: newUser.customAvatar,
          country: newUser.country,
          about: newUser.about,
        };
        user.insert(userLocal, (err, doc) => {
          err ? reject(err) : resolve(doc);
        });
      });
    },

    find: function find(query) {
      return new Promise((resolve, reject) => {
        user.find(query, {
          password: 0
        }, (err, doc) => {
          err ? reject(err) : resolve(doc);
        });
      });
    },

    findOne: function findById(param) {
      const self = this;
      return new Promise((resolve, reject) => {
        if (param._id) param._id = main.db.ObjectId(param._id);
        if (param.resetPasswordToken) param.resetPasswordToken = cryptopass(param.resetPasswordToken);
        user.findOne(param, {
          password: 0,
        }, (err, doc) => {
          err ? reject(err) : resolve(doc);
        });
      });
    },

    auth: function auth(email, password) {
      const self = this
      const _email = email.toLowerCase();
      const encryptedPass = cryptopass(password);
      return new Promise((resolve, reject) => {
        user.findOne({
          email: _email,
          password: encryptedPass,
        }, {
          password: 0,
        }, (err, doc) => {
          err ? reject(err) : resolve(doc);
        });
      });
    },

    findById: function findById(id) {
      return new Promise((resolve, reject) => {
        user.findOne({ _id: main.db.ObjectId(id) }, {
          activationToken: 0,
          password: 0,
        }, (err, doc) => {
          err ? reject(err) : resolve(doc);
        });
      });
    },

    deleteLocal: function deleteLocal(id, password) {
      const self = this;
      return new Promise((resolve, reject) => {
        user.remove({ _id: main.db.ObjectId(id), password: cryptopass(password) }, (err, doc) => {
          err ? reject(err) : resolve(doc);
          // reject(new Error('DB down'))
        });
      });
    },

    update: function update(id, userChanges) {
      return new Promise((resolve, reject) => {
        userChanges.password ? userChanges.password = cryptopass(userChanges.password) : null;
        user.findAndModify({
          query: { _id: main.db.ObjectId(id) },
          update: { $set: userChanges },
          fields: {
            activationToken: 0,
            password: 0,
          },
          new: true,
        }, (err, doc, lastErrorObject) => {
          err ? reject(err) : resolve(doc);
        });
      });
    },

    activate: function activate(email, activationToken) {
      return new Promise((resolve, reject) => {
        user.findAndModify({
          query: { activationToken },
          update: { $set: { enable: true } },
          fields: {
            activationToken: 0,
            password: 0,
          },
          new: true,
        }, (err, doc, lastErrorObject) => {
          err ? reject(err) : resolve(doc);
        })
      });
    },

    resetPassword: function resetPassword(_id) {
      const self = this;
      return new Promise((resolve, reject) => {
        const token = self.tokenGenerator();
        self.update(_id, { resetPasswordToken: cryptopass(token) });
        resolve(token);
      });
    }

    // db.getCollection('users').findAndModify({
    //           query: { _id: ObjectId("5886526b246852c5fa22ff68") },
    //           update: { $set: { firstname: 'ggg' } },
    //           new: true,
    //         })
    //
    //
    // user.findOneAndUpdate(
    //   {_id: main.db.ObjectId(id)},
    //   {$set: { firstname: 'maintainer' } }

    // verifyPass
    // delete:,
    // modify:,
    // findOne:,
    // verifyPassword:,
    // cryptopass
    // cryptohash
    // verifyPass
    // findById


  };
}
module.exports = User;

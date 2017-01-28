'use strict'

const gravatar = require('gravatar');

function User(main) {
  const model = main.model;
  const libs = main.libs;
  const email = main.libs.email;
  const REGISTER_CONFIRMATION = main.config.get('options.REGISTER_CONFIRMATION');

  return {

    loginUser: (req, res, next) => {
      main.passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.send({
            success: false,
            message: 'authentication failed',
            redirect: req.session.returnTo || '/' });
        }
        if (REGISTER_CONFIRMATION) {
          if (!user.enable) {
            return res.send({
              success: false,
              message: 'Please confirm your account first!, check your email',
              redirect: req.session.returnTo || '/',
            });
          }
        }
        req.login(user, err => {
          if (err) {
            return next(err);
          }
          return res.status(200).send({
            success: true,
            message: 'authentication succeeded',
            redirect: req.session.returnTo || '/' });
        });
      })(req, res, next);
    },

    listUsers: (req, res, next) => {
      const cmd = {
        title: 'USER LIST',
      };
      model.user.find({})
      .then((users) => {
        console.log(users);
        return res.status(200).render('userlist', { users, title: cmd.title });
      })
      .catch((err) => {
        console.log(err);
      });
    },

    showUser: (req, res, next) => {
      const username = req.params.username;
      const cmd = {
        title: 'USER ACTIVITY',
      };
      model.user.findOne({ username })
        .then((user) => {
          if (!user) {
            const err = new Error();
            err.status = 404;
            throw err;
          }
          return res.status(200).render('userPublic', { user, title: cmd.title });
        })
        .catch((err) => {
          if (err.status === 404) {
            return res.status(404).render('userNotFound', { title: 'USER NOT FOUND' });
          }
          return next(err);
        });
    },

    showUserProfile: (req, res, next) => {
      const cmd = {
        title: 'PROFILE',
      };
      return res.status(200).render('profile', { title: cmd.title });
    },

    createUser: (req, res, next) => {
      const newUser = {
        firstname: undefined,
        lastname: undefined,
        gender: undefined,
        birth: undefined,
        username: req.body.username,
        email: req.body.email,
        password1: req.body.password1,
        password2: req.body.password2,
        legals: true,
        defaultAvatar: undefined,
        customAvatar: undefined,
        about: undefined,
        error: [],
      };
      libs.userValidator(newUser)
        .then((validatedUser) => {
          validatedUser.defaultAvatar = `http:${gravatar.url(validatedUser.email, { s: '200', f: 'y', d: 'retro' })}`;
          if (!validatedUser.error.length) { // No validation errors.
            model.user.find({ $or: [ // Need to change for findOne on db
              { username: validatedUser.username },
              { email: validatedUser.email },
            ] })
              .then((docs) => {
                if (docs.length) { // Check username & email already exist
                  docs.forEach((user) => {
                    if (user.username === validatedUser.username) {
                      validatedUser.error.push('Username already exist');
                    }
                    if (user.email === validatedUser.email) {
                      validatedUser.error.push('Email already exist');
                    }
                  });
                  return res.send({ message: validatedUser.error }); // mando las coincidencias
                } else {
                  model.user.createLocal(validatedUser) // No error, saves new user
                  .then((storedUser) => {
                    const emailOptions = {
                      // baseURL: req.protocol + '://' + req.get('host'),
                      username: storedUser.username,
                      email: storedUser.email, // list of receivers
                      token: storedUser.activationToken,
                    };
                    email.greetings(emailOptions, (error, info) => { // Send gretting email
                      if (error) {
                        return console.log(error);
                      }
                      // console.log('Message sent: ' + info.response);
                      return res.send({ username: storedUser.username, message: [] });
                    });
                  });
                }
              });
          } else {
            return res.send({ message: validatedUser.error });
          }
        })
        .catch((err) => {
          err.status = 500;
          return next(err);
        });
    },

    deleteUser: (req, res, next) => {
      const id = req.session.passport.user;
      const password = req.body.password;
      model.user.deleteLocal(id, password)
        .then((doc) => {
          if (!doc.n) {
            res.status(401);
            return res.send({ message: 'User cant be deleted (wrong password)' });
          }
          return res.send({ message: 'User was deleted' });
        })
        .catch((err) => {
          err.status = 500;
          return next(err);
        });
    },

    updateUser: (req, res, next) => {
      const id = req.user._id;
      const userChanges = req.body;
      const birthContructor = new Date(`${req.body.birthMonth}/${req.body.birthDay}/${req.body.birthYear}`);
      delete userChanges.birthMonth;
      delete userChanges.birthDay;
      delete userChanges.birthYear;
      userChanges.birth = birthContructor;
      if (req.file) {
        userChanges.customAvatar = req.file.filename;
      }
      model.user.update(id, userChanges)
        .then((doc) => {
          return res.send({ message: 'Changes made successfully' });
        })
        .catch((err) => {
          return res.send({ message: 'Error, try again later' });
        });
    },

    activateUser: (req, res, next) => {
      const cmd = {
        title: 'ACTIVATION COMPLETE',
      };
      const email = req.query.email;
      const activationToken = req.query.activationToken; // TODO check expiration time for the link (72hrs)
      model.user.activate(email, activationToken)
        .then((doc) => {
          return res.render('activation', { title: cmd.title, enable: doc.enable });
        })
        .catch((err) => {
          err.status = 500;
          return next(err);
        });
    },

    resetPassword_get: (req, res, next) => {
      const cmd = {
        title: 'RESET PASSWORD',
      };
      return res.render('resetPassword', { title: cmd.title });
    },

    resetpassword_post: (req, res, next) => {
      const resetPasswordToken = req.query.reset_password_token;
      const email = req.query.email;
      const password = req.body.password;
      model.user.findOne({ resetPasswordToken })
        .then((user) => {
          if (!user) {
            res.status(404);
            return res.send({ message: 'Operation cant be completed' })
          }
          model.user.update(user._id, { password, resetPasswordToken: model.user.tokenGenerator() })
            .then((user) => {
              return res.send({ message: 'OK' });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
}

module.exports = User;

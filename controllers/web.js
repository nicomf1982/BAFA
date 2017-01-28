'use strict';

function Web(main) {
  const model = main.model;
  const libs = main.libs;
  const email = main.libs.email;

  return {
    home: (req, res, next) => {
      const cmd = {
        title: 'HOME',
      };
      return res.render('home', { title: cmd.title });
    },
    about: (req, res, next) => {
      const cmd = {
        title: 'ABOUT',
      };
      return res.render('about', { title: cmd.title });
    },
    login: (req, res, next) => {
      return res.redirect('/');
    },
    forgot_get: (req, res, next) => {
      const cmd = {
        title: 'FORGOT',
      };
      return res.render('forgot', { title: cmd.title });
    },
    forgot_post: (req, res, next) => {
      const _email = req.body.email;
      model.user.findOne({ email: _email })
        .then((user) => {
          if(user) {
            model.user.resetPassword(user._id)
            .then((resetPasswordToken) => {
              email.sendResetPassword({
                email: user.email,
                token: resetPasswordToken,
                username: user.username,
              }, (err, info) => {
                if (err) {
                  console.log(err);
                }
                console.log(info);
              });
            });
          }
        })
        .catch((err) => {
          console.log('ERR', err);
        });
      return res.send({ message: 'Check your email for instruction to generate new password' });
    },
    register: (req, res, next) => {
      const cmd = {
        title: 'REGISTER',
      };
      return res.render('register', { title: cmd.title });
    },
    contact_get: (req, res, next) => {
      const cmd = {
        title: 'CONTACT',
      };
      return res.render('contact', { title: cmd.title });
    },
    contact_post: (req, res, next) => {
      const cmd = {
        title: 'CONTACT',
      };
      console.log('Enviar email con :' + req.body.name, req.body.email, req.body.comment);
      return res.render('contact', { title: cmd.title });
    },
    logout: (req, res, next) => {
      req.logout();
      return res.redirect('/');
    },
    activation: (req, res, next) => {
      const cmd = {
        title: 'ACTIVATION',
      };
      return res.render('activation', { title: cmd.title });
    },
  }
}

module.exports = Web;

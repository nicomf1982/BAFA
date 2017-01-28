
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const xoauth2 = require('xoauth2');

function Email(main) {
  const templatesDir = path.resolve(__dirname, '../views', 'email-templates');
  const emailDirect = main.config.get('options.EMAIL_DIRECT');
  const emailSmtp = main.config.get('options.EMAIL_SMTP');
  const emailDefault = main.config.get('emailDefault');
  const xoauthOptions = main.config.get('xoauthOptions');
  const registerConfirmation = main.config.options.REGISTER_CONFIRMATION;
  const baseURL = `${main.protocol}${main.domain}:${main.port}`;

  const transporter = (() => {
    // SMTP Direct method,
    if (emailDirect) {
      // create reusable transporter object using the default SMTP transport
      return nodemailer.createTransport({
        direct: true,
      });
    }
    // XOAuth2 Gmail method,
    if (emailSmtp) {
      // create reusable transporter object using the default SMTP transport
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          xoauth2: xoauth2.createXOAuth2Generator(xoauthOptions),
        },
      });
    }
  })();
  function send(emailOptions, subject, emailTemplate) {
    const template = new EmailTemplate(path.join(templatesDir, emailTemplate));
    const locals = {
      registerConfirmation: registerConfirmation,
      baseURL: baseURL,
      token: emailOptions.token || '',
      email: emailOptions.email,
      name: {
        first: emailOptions.username,
        last: '!',
      },
      proyectName: emailDefault.proyectName,
    };
    // Send a single email
    template.render(locals, (err, results) => {
      if (err) {
        return console.error(err);
      }
      transporter.sendMail({
        from: emailDefault.from,
        to: locals.email,
        subject: subject,
        html: results.html,
        text: results.text
      }, (err, responseStatus) => {
        if (err) {
          return console.error(err);
        }
        // console.log('RESPONSE: ' + responseStatus.response);
      });
    });
  }

  // Check XOAuth connection
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Nodemailer connection READY!');
    }
  });

  return {

    greetings: (emailOptions, cb) => {
      send(emailOptions, 'Welcome !', 'registration-confirm');
      cb(null, { response: 'SUCCESS' });
    },
    sendResetPassword: (emailOptions, cb) => {
      send(emailOptions, 'Reset Password instruction', 'reset-password');
      cb(null, { response: 'SUCCESS' });
    },
  };
}

module.exports = Email;

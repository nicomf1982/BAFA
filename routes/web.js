'use strict';
const router = require ('express').Router();

function Router(main) {
  const web = main.controllers.web;
  const foo = require('../controllers/testApi.js')

  /* GET Home. */
  router.get('/', web.home);
  /* GET About. */
  router.get('/about', web.about);
  /* GET Login. */
  router.get('/login', web.login);
  /* GET Register. */
  router.get('/register', web.register);
  /* GET Contact. */
  router.get('/contact', web.contact_get);
  /* POST Contact. */
  router.post('/contact', web.contact_post);
  /* GET Logout. */
  router.get('/logout', web.logout);
  /* GET Forgot. */
  router.get('/forgot', web.forgot_get); // le pido el email y hacemos POST en /forgot con el mail
  /* POST Forgot. */
  router.post('/forgot', web.forgot_post); // le mando le mail con le hash , asi verifico que tiene acceso a ese mail
  // /* GET Activation. */
  // router.get('/activation', web.activation);
  router.get('/time', (req, res, next) => {
    const cmd = {
      title: 'Time',
    };
    const response = foo.time();
    res.render('time', { title: cmd.title, time: response });
  });
  return router;
}
module.exports = Router;

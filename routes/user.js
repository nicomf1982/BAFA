'use strict';
const router = require('express').Router();

function Router(main) {
  const user = main.controllers.user;
  const ensureLoggedIn = main.libs.account.ensureLogged;
  const upload = main.upload;
  const validator = main.libs.postValidator;

  /* POST Auth. */
  router.post('/auth', validator.authPost(), user.loginUser);
  /* GET Users list. */
  router.get('/', user.listUsers);
  /* GET User profile. */
  router.get('/profile', ensureLoggedIn('/login'), user.showUserProfile);
  /* GET User. */
  router.get('/:username', user.showUser);
  /* POST User. */
  router.post('/', validator.userPost(), user.createUser);
  /* DELETE User. */
  router.delete('/', ensureLoggedIn('/login'), user.deleteUser);
  /* PUT Use.r */
  router.put('/', ensureLoggedIn('/login'), validator.userPut, upload.single('customAvatar'), user.updateUser);
  /* GET Activation. */
  router.get('/activation/', user.activateUser);
  /* GET Reset Password. */
  router.get('/resetPassword', user.resetPassword_get);
  /* POST Reset Password. */
  router.post('/resetPassword/', user.resetpassword_post);

  return router;
}
module.exports = Router;

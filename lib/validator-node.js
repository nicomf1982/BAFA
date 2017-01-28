'use strict';

const validator = require('node-validator');

const emailRegex = new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

// function validateFooXorBar(value, onError) {
//   if (value.foo !== undefined && value.bar !== undefined) {
//     onError('both foo and bar may not be defined', 'foo|bar', null);
//   }
// }

exports.authPost = function authPost() {
  return validator.express((() => {
    const check = validator.isObject()
    .withRequired('email', validator.isString({
      regex: emailRegex,
      message: 'Invalid email format',
    }))
    .withRequired('password', validator.isString({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }));
    return check;
  })());
};

exports.userPost = function userPost() {
  return validator.express((() => {
    const check = validator.isObject()
    .withRequired('username', validator.isString({
      regex: /^[\w.]{3,30}$/,
      message: 'Invalid username format',
    }))
    .withRequired('email', validator.isString({
      regex: emailRegex,
      message: 'Invalid email format',
    }))
    .withRequired('password1', validator.isString({
      regex: /^[\x20-\x7E]{8,200}$/,
      message: 'Password wrong',
    }))
    .withRequired('password2', validator.isString({
      regex: /^[\x20-\x7E]{8,200}$/,
      message: 'Password wrong',
    }))
    .withRequired('legals');
    return check;
  })());
};

exports.userPut = function userPut() {
  return validator.express((() => {
    const check = validator.isObject()
    .withOptional('customAvatar', validator.isString({
      regex: emailRegex,
      message: 'Invalid email format',
    }))
    .withOptional('firstname', validator.isString({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }))
    .withOptional('lastname', validator.isString({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }))
    .withOptional('birthDay', validator.isNumber({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }))
    .withOptional('birthMonth', validator.isNumber({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }))
    .withOptional('birthYear', validator.isNumber({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }))
    .withOptional('gender', validator.isString({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }))
    .withOptional('country', validator.isString({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }))
    .withOptional('about', validator.isString({
      regex: /^[\x20-\x7E]{3,200}$/,
      message: 'Password wrong',
    }));
    return check;
  })());
};

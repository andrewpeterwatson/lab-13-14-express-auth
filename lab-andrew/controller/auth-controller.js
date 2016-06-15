'use strict';

const debug = require('debug')('authwork:auth-controller');
const httpErrors = require('http-errors');
const User = require('../model/user');

exports.signup = function(reqBody) {
  debug('signup');
  return new Promise((resolve, reject) => {
    var password = reqBody.password;
    delete reqBody.password;
    var user = new User(reqBody);
    user.generateHash(password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => resolve(token))
    .catch(reject);
  });
};

exports.signin = function(auth) {
  debug('signin');
  return new Promise((resolve, reject) => {
    User.findOne({username: auth.usernname
    }).then(user => {
      if(!user) return reject(httpErrors(401, 'not a valid user'));
      return user;
    })
    .then(user => user.compareHash(auth.password))
    .then(user => user.generateToken())
    .then(token => resolve(token))
    .catch(reject);
  });
};

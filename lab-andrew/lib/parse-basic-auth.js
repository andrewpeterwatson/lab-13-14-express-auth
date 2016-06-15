'use strict';

const httpErrors = require('http-errors');
const debug = require('debug')('authwork:parse-basic-auth');

module.exports = function(req, res, next){
  debug('parseBasicAuth');
  if(!req.headers.authorization)
    return next(httpErrors('401', 'requires authorization header'));
  let authHeader = req.headers.authorization;
  let namePassword = authHeader.split(' ')[1];
  namePassword = new Buffer(namePassword, 'base64').toString('utf8');
  namePassword = namePassword.split(':');
  req.auth = {
    username: namePassword[0]
    , password: namePassword[1]
  };
  if(!req.auth.username)
    return next(httpErrors(401, 'no username proveded'));
  if(!req.auth.password)
    return next(httpErrors(401, 'no password was provided'));
  next();
};

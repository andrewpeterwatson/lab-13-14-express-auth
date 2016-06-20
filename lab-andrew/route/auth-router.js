'use strict';

const Router = require('express').Router;

const jsonParser = require('body-parser').json();
const parseBasicAuth = require('../lib/parse-basic-auth');


const authController = require('../controller/auth-controller');

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  authController.signup(req.body)
  .then( token => res.send(token))
  .catch(next);
});

authRouter.get('/signin', jsonParser, parseBasicAuth, (req, res, next) => {
  console.log('req.auth', req.auth);
  authController.signin(req.auth)
  .then( token => res.send(token))
  .catch(next);
});

'use strict';


const debug = require('debug')('authdemo:brew-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();


const parseBearerAuth = require('../lib/parse-bearer-auth');
const brewController = require('../controller/brew-controller');

const brewRouter = module.exports = new Router();

brewRouter.post('/brew', parseBearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/brew');
  req.body.userId = req.userId;
  brewController.createBrew(req.body)
  .then( brew => res.json(brew))
  .catch(next);
});

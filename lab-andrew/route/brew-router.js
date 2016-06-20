'use strict';


const debug = require('debug')('authdemo:brew-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();


const httpErrors = require('http-errors');
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


brewRouter.get('/brew', (req, res, next) => {
  next(httpErrors(400, ' no Id'));
});

brewRouter.get('/brew/:id', parseBearerAuth, (req, res, next) => {
  brewController.fetchItem(req.params.id)
  .then(brew => {
    if(!brew) return next(httpErrors(404, 'not found'));
    res.json(brew);
  })
  .catch(next);
});
brewRouter.get('/brew/all', parseBearerAuth, (req, res, next) => {
  brewController.fetchAllBrews()
  .then((brew) => {
    res.json(brew);
  })
  .catch(next);
});

brewRouter.put('/brew/:id', parseBearerAuth, jsonParser, (req, res, next) => {
  brewController.updateBrew(req.params.id, req.body)
  .then(brew => {
    if(!brew) return next(httpErrors(404, 'not found'));
    res.json(brew);
  })
  .catch(next);
});

brewRouter.delete('/brew/:id', parseBearerAuth, (req, res, next) => {
  brewController.removeAllBrews(req.params.id)
  .then(() => {
    res.status(204).send();
  })
  .catch(next);
});

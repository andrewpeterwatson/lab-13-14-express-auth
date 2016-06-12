'use strict';

const debug = require('debug')('authwork:brew-controller');
const Brew = require('../model/brew');
const httpErrors = require('http-errors');

exports.createBrew = function(brewData) {
  debug('createBrew');
  return new Promise((resolve, reject) => {
    new Brew(brewData).save()
    .then(brew => resolve(brew))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.removeAllBrews = function() {
  return Brew.remove({});
};

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

exports.fetchItem = function(brewId) {
  return new Promise((resolve, reject) => {
    Brew.findOne({_id: brewId})
    .then(brew => {
      resolve(brew);
    })
    .catch(() => reject(httpErrors(404, 'brew not found')));
  });
};

exports.updateBrew = function(brewId, reqBody) {
  return new Promise((resolve, reject) => {
    if(Object.keys(reqBody).length === 0) return reject(httpErrors(400, 'body cannot be found'));
    const brewKeys = ['brewMethod', 'brewRatio'];
    Object.keys(reqBody).forEach((key) => {
      if(brewKeys.indexOf(key) === -1) return reject(httpErrors(400, 'no key provided'));
    });

    Brew.findByIdAndUpdate(brewId, reqBody)
    .then(() => Brew.findOne({_id: brewId})
    .then(resolve))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchAllBrews = function() {
  return new Promise((resolve, reject) => {
    Brew.find({})
    .then(resolve)
    .catch(reject);
  });
};

exports.removeAllBrews = function() {
  return Brew.remove({});
};

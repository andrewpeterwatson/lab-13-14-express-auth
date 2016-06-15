'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('authwork:brew');

const brewSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true}
  , brewMethod: {type: 'String'}
  , brewRatio: {type: Array, required: true}
  , userId: {type: mongoose.Schema.ObjectId, required: true}
});

const Brew = module.exports = mongoose.model('brew', brewSchema);

Brew.schema.path('brewRatio').validate(function(value) {
  debug('Brew schema');
  if(value.length < 1 ) return false;
  if(value.length > 5 ) return false;
  return true;
});

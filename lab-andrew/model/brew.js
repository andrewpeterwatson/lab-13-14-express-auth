'use strict';

const mongoose = require('mongoose');
// const debug = require('debug')('authwork:brew');

const brewSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true}
  , brewRatio: {type: Array, required: true}
  , brewMethod: {type: 'String'}
  , userId: {type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('brew', brewSchema);

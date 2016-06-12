'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('authwork:server');

const handleError = require('./lib/handle-error');
const parserBearerAuth = require('./lib/parse-bearer-auth');
const authRouter = require('./route/auth-router');
const brewRouter = require('./route/brew-router');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/authdev';

mongoose.connect(mongoURI);

app.use(morgan('dev'));

app.all('/', parserBearerAuth, function(req, res) {
  console.log('req.userId', req.userId);
  res.send('varified');
});

app.use('/api', authRouter);
app.use('/api', brewRouter);

app.all('*', function(req, res, next) {
  debug('404 * route');
  next(httpErrors(404, 'no such route'));
});

app.use(handleError);

const server = app.listen(port, function() {
  console.log('server running on PORT: ', port);
});

server.isRunning = true;
module.exports = server;

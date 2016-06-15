'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'trollsaywat';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authwork:auth-route-test');
const userController = require('../controller/user-controller');
const authController = require('../controller/auth-controller');

const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api`;
const server = require('../server');

request.use(superPromise);

describe('testing auth-router module', () => {
  before((done) => {
    debug('before block, auth-test');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after block, auth-test');
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        done();
      });
      done();
    }
  });

  describe('bad enpoint', () => {
    it('should return 404 not found', (done) => {
      request.post(`${baseUrl}/trollToe`)
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
    });
  });

  describe('testing POST /api/signup', () => {
    after((done) => {
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });
    it('should return a token', (done) => {
      request.post(`${baseUrl}/signup`)
      .send({
        username: '!arms',
        password: 'trollToe'
      })
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(done);
    });

    it('should return a 400 bad request', (done) => {
      request.post(`${baseUrl}/signup`)
      .send({
        username: '!arms'
      })
      .catch(err => {
        expect(err.response.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing GET /api/signin', () => {
    before((done) => {
      authController.signup({
        username: '!arms',
        password: 'trolls'
      })
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', (done) => {
      request.get(`${baseUrl}/signin`)
      .auth('!arms', 'trolls')
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(done);
    });

    it('should return a 401 user not found', (done) => {
      request.get(`${baseUrl}/signin`)
      .auth('cury', 'cury')
      .catch(err => {
        expect(err.response.status).to.equal(401);
        done();
      });
    });
  });
});

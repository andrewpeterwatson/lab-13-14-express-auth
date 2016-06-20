'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'trollsaywat';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authwork:brew-route-test');

const brewController = require('../controller/brew-controller');
const userController = require('../controller/user-controller');
const authController = require('../controller/auth-controller');

const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api`;
const server = require('../server');

request.use(superPromise);

describe('testing module brew-router', () => {
  before((done) => {
    debug('before block brew auth');
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
    if(server.isrunning) {
      server.close(() => {
        server.isRunning = false;
        done();
      });
      return;
    }
    done();
  });

  describe('testing module for brew router', () => {
    beforeEach((done) => {
      authController.signup({username: '!armsTest', password: 'trollToe'})
      .then(token =>
        this.tempToken = token)
      .then(() => done())
      .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers(),
        brewController.removeAllBrews()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('testing POST /api/brew', () => {
      it('should return a brew', (done) => {
        request.post(`${baseUrl}/brew`)
        .send({
          name: 'brew1',
          brewRatio: 'trollFat',
          brewMethod: 'chemex'
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(200);
          done();
          return this.tempBrew = res.body;
        })
        .catch(done);
      });
    });

    describe('testing GET /api/brew/:id', () => {
      it('should return a brew', (done) => {
        request.get(`${baseUrl}/brew/${this.tempBrew._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });

      it('should return a 404 not found', (done) => {
        request.get(`${baseUrl}/brew/no trolls`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .catch(err => {
          expect(err.response.status).to.equal(404);
          done();
        });
      });

      it('should return a 400 for no brew', (done) => {
        request.get('{baseUrl}/brew')
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .catch(err => {
          expect(err.response.status).to.equal(400);
          done();
        });
      });
    });

    describe('testing PUT /api/brew/:id', () => {
      it('should return a new brew', (done) => {
        request.put(`${baseUrl}/brew/${this.tempBrew._id}`)
        .set({
          Authorization: `Bearer ${this.tempBrew}`
        })
        .send({
          brewMethod: 'chemex'
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.brewMethod).to.equal('chemex');
          done();
        })
        .catch(done);
      });
    });

    describe('testing PUT /api/brew/', () => {
      it('should return a 400', (done) => {
        request.put(`${baseUrl}/brew/no trolls`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .catch(err => {
          expect(err.response.status).to.equal(400);
          done();
        });
      });

      it('should return a 404 not found', (done) => {
        request.put('$baseUrl/brew/no troll')
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({
          brewMethod: 'chemex'
        })
        .catch(err => {
          expect(err.response.status).to.equal(404);
          done();
        });
      });
    });

    describe('GET /api/brew/all', () => {
      it('should return an array of brews', (done) => {
        request.get(`${baseUrl}/brew/all`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('DELETE /api/brew/:id', () => {
      it('should return a 204', (done) => {
        request.del(`${baseUrl}/brew/${this.tempBrew._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
    });
  });
});

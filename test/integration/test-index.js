const supertest = require('supertest');
const assert = require('assert');
const path = require('path');
const app = require('../../index');

describe('Integration', function() {
  before(function() {
    app.apiDataPath = path.join(__dirname, '..', 'data');
  });

  it('HTTP GET call to a wrong address', function(done) {
    supertest(app.app)
      .get('/wrong')
      .expect(404)
      .end(done);
  });

  it('HTTP GET call to a right address', function(done) {
    supertest(app.app)
      .get('/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'value');
        return done();
      });
  });

  it('HTTP GET call to a right address with parameters', function(done) {
    supertest(app.app)
      .get('/call?param1=value1')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyWithParam === 'value');
        return done();
      });
  });

  it('HTTP GET call to a malformed JSON', function(done) {
    supertest(app.app)
      .get('/malformed')
      .expect(500)
      .end(done);
  });

  it('HTTP POST call to a wrong address', function(done) {
    supertest(app.app)
      .post('/wrong')
      .expect(404)
      .end(done);
  });

  it('HTTP POST call to a right address', function(done) {
    supertest(app.app)
      .post('/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyPOST === 'value');
        return done();
      });
  });

  it('HTTP POST call to a right address with parameters', function(done) {
    supertest(app.app)
      .post('/call')
      .send({param1: 'value1'})
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyWithParamPOST === 'value');
        return done();
      });
  });

  it('HTTP POST call to a malformed JSON', function(done) {
    supertest(app.app)
      .post('/malformed')
      .expect(500)
      .end(done);
  });

  it('HTTP OPTIONS call to a wront address', function(done) {
    supertest(app.app)
      .options('/generic/options')
      .expect(404)
      .end(done);
  });

  it('HTTP OPTIONS call to a right address', function(done) {
    supertest(app.app)
      .options('/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        return done();
      });
  });
});

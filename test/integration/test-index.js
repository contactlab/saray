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

  it('HTTP GET call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'value');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/call4')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'value');
        return done();
      });
  });

  it('HTTP GET call to a right address with parameters with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/call?param1=value1')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyWithParam === 'value');
        return done();
      });
  });

  it('HTTP GET call to a right address with parameters with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/call4?param1=value1')
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

  it('HTTP POST call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyPOST === 'value');
        return done();
      });
  });

  it('HTTP POST call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/call4')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyPOST === 'value');
        return done();
      });
  });

  it('HTTP POST call to a right address with parameters with JSON stubbed data', function(done) {
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

  it('HTTP POST call to a right address with parameters with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/call4')
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

  it('HTTP OPTIONS call to a wrong address', function(done) {
    supertest(app.app)
      .options('/generic/options')
      .expect(404)
      .end(done);
  });

  it('HTTP OPTIONS call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/call')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/call2?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params 2 with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/call3?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .options('/call4')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params with JS stubbed data', function(done) {
    supertest(app.app)
      .options('/call5?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params 2 with JS stubbed data', function(done) {
    supertest(app.app)
      .options('/call6?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });
});

describe('Integration with rootPath', function() {
  before(function() {
    app.apiDataPath = path.join(__dirname, '..', 'data');
    app.rootPath = '/saray/abc';
    app.app.use(app.rootPath, app.sarayRouter);
  });

  it('HTTP GET call to a wrong address', function(done) {
    supertest(app.app)
      .get('/saray/abc/wrong')
      .expect(404)
      .end(done);
  });

  it('HTTP GET call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'value');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/call4')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'value');
        return done();
      });
  });

  it('HTTP GET call to a right address with parameters with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/call?param1=value1')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyWithParam === 'value');
        return done();
      });
  });

  it('HTTP GET call to a right address with parameters with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/call4?param1=value1')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyWithParam === 'value');
        return done();
      });
  });

  it('HTTP GET call to a malformed JSON', function(done) {
    supertest(app.app)
      .get('/saray/abc/malformed')
      .expect(500)
      .end(done);
  });

  it('HTTP POST call to a wrong address', function(done) {
    supertest(app.app)
      .post('/saray/abc/wrong')
      .expect(404)
      .end(done);
  });

  it('HTTP POST call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyPOST === 'value');
        return done();
      });
  });

  it('HTTP POST call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/call4')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyPOST === 'value');
        return done();
      });
  });

  it('HTTP POST call to a right address with parameters with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/call')
      .send({param1: 'value1'})
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.keyWithParamPOST === 'value');
        return done();
      });
  });

  it('HTTP POST call to a right address with parameters with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/call4')
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
      .post('/saray/abc/malformed')
      .expect(500)
      .end(done);
  });

  it('HTTP OPTIONS call to a wrong address', function(done) {
    supertest(app.app)
      .options('/saray/abc/generic/options')
      .expect(404)
      .end(done);
  });

  it('HTTP OPTIONS call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/saray/abc/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/saray/abc/call2?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params 2 with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/saray/abc/call3?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .options('/saray/abc/call4')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params with JS stubbed data', function(done) {
    supertest(app.app)
      .options('/saray/abc/call5?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });

  it('HTTP OPTIONS call to a right address with params 2 with JS stubbed data', function(done) {
    supertest(app.app)
      .options('/saray/abc/call6?param1=value1')
      .expect(200)
      .end(function(err) {
        assert.ok(!err);
        return done();
      });
  });
});

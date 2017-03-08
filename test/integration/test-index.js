const supertest = require('supertest');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const app = require('../../index');
const utils = require('../../utils');

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

  it('HTTP GET CORS call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/call')
      .set('Origin', 'http://saray.example.com')
      .set('custom-header1', 'custom-value1')
      .set('custom-header2', 'custom-value2')
      .set('Access-Control-Request-Headers', 'custom-header1, custom-header2')
      .set('Access-Control-Request-Method', 'GET')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(
          response.headers['access-control-allow-headers'] === 'Origin, X-Requested-With, Content-Type, Accept, Authorization, custom-header1, custom-header2'
        );
        return done();
      });
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

  it('HTTP POST call to a right address with parameters returned from the body of the call', function(done) {
    supertest(app.app)
      .post('/call')
      .send({param1: 'value1'})
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.param1 === 'value1');
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

  it('HTTP GET call to a right address with JS stubbed data to an updated file', function(done) {
    supertest(app.app)
      .get('/call6')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key, 'value');
        // return done();
      });

    const strippedPath = utils.stripRootPath(app.rootPath, '/call6');
    const filePath = path.join(app.apiDataPath, strippedPath + '.GET.js');
    const dataFile = fs.readFileSync(filePath);
    const dataFileContent = dataFile.toString();
    const dataFileContentReplaced = dataFileContent.replace('value', 'value2');
    fs.writeFileSync(filePath, dataFileContentReplaced);

    supertest(app.app)
      .get('/call6')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.equal(response.body.key, 'value2');

        const dataFileContentReplaced2 = dataFileContent.replace('value2', 'value');
        fs.writeFileSync(filePath, dataFileContentReplaced2);

        supertest(app.app)
          .get('/call6')
          .expect(200)
          .end(function(err, response) {
            assert.ok(!err);
            assert.equal(response.body.key, 'value');
            return done();
          });
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first', function(done) {
    supertest(app.app)
      .get('/jsFirst')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.deepEqual(response.body.key, 'valueJS');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first with parameters', function(done) {
    supertest(app.app)
      .get('/jsFirst?param1=valueParam')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.deepEqual(response.body.key, 'valueJSvalueParam');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first with parameters 2', function(done) {
    supertest(app.app)
      .get('/jsFirst?param2=value2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.deepEqual(response.body.key, 'valueJS with param 2');
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

  it('HTTP GET CORS call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/call')
      .set('Origin', 'http://saray.example.com')
      .set('custom-header1', 'custom-value1')
      .set('custom-header2', 'custom-value2')
      .set('Access-Control-Request-Headers', 'custom-header1, custom-header2')
      .set('Access-Control-Request-Method', 'GET')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(
          response.headers['access-control-allow-headers'] === 'Origin, X-Requested-With, Content-Type, Accept, Authorization, custom-header1, custom-header2'
        );
        return done();
      });
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
        assert.ok(response.body.param1 === 'value1');
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
        assert.ok(response.body.param1 === 'value1');
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
      .end(function(err) {
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

  it('HTTP GET call to a right address with JS stubbed data to an updated file', function(done) {
    supertest(app.app)
      .get('/saray/abc/call6')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key, 'value');
        // return done();
      });

    const strippedPath = utils.stripRootPath(app.rootPath, '/saray/abc/call6');
    const filePath = path.join(app.apiDataPath, strippedPath + '.GET.js');
    const dataFile = fs.readFileSync(filePath);
    const dataFileContent = dataFile.toString();
    const dataFileContentReplaced = dataFileContent.replace('value', 'value2');
    fs.writeFileSync(filePath, dataFileContentReplaced);

    supertest(app.app)
      .get('/saray/abc/call6')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.equal(response.body.key, 'value2');

        const dataFileContentReplaced2 = dataFileContent.replace('value2', 'value');
        fs.writeFileSync(filePath, dataFileContentReplaced2);

        supertest(app.app)
          .get('/saray/abc/call6')
          .expect(200)
          .end(function(err, response) {
            assert.ok(!err);
            assert.equal(response.body.key, 'value');
            return done();
          });
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first', function(done) {
    supertest(app.app)
      .get('/saray/abc/jsFirst')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.deepEqual(response.body.key, 'valueJS');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first with parameters', function(done) {
    supertest(app.app)
      .get('/saray/abc/jsFirst?param1=valueParam')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.deepEqual(response.body.key, 'valueJSvalueParam');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first with parameters 2', function(done) {
    supertest(app.app)
      .get('/saray/abc/jsFirst?param2=value2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.deepEqual(response.body.key, 'valueJS with param 2');
        return done();
      });
  });
});

describe('Integration with dynamic path feature enabled', function() {
  before(function() {
    app.apiDataPath = path.join(__dirname, '..', 'data');
    app.dynPath = '_';
  });

  it('HTTP GET call to a wrong address', function(done) {
    supertest(app.app)
      .get('/wrong')
      .expect(404)
      .end(done);
  });

  it('HTTP GET CORS call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/call')
      .set('Origin', 'http://saray.example.com')
      .set('custom-header1', 'custom-value1')
      .set('custom-header2', 'custom-value2')
      .set('Access-Control-Request-Headers', 'custom-header1, custom-header2')
      .set('Access-Control-Request-Method', 'GET')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(
          response.headers['access-control-allow-headers'] === 'Origin, X-Requested-With, Content-Type, Accept, Authorization, custom-header1, custom-header2'
        );
        return done();
      });
  });

  it('HTTP GET call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/somepath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value');
        return done();
      });
  });

  it('HTTP POST call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/somepath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/somepath/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/somepath/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath-POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/somepath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath');
        return done();
      });
  });

  it('HTTP POST call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/somepath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/somepath/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/somepath/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/somepath/call/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/somepath/call/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/somepath/call/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath-2');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/somepath/call/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath-2-POST');
        return done();
      });
  });

  it('HTTP GET call to a wildcard with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/totallyrandomapi')
      .expect(404)
      .end(done);
  });
});

describe('Integration with dynamic path feature enabled', function() {
  before(function() {
    app.apiDataPath = path.join(__dirname, '..', 'data');
    app.dynPath = '_';
    app.rootPath = '/saray/abc';
    app.app.use(app.rootPath, app.sarayRouter);
  });

  it('HTTP GET call to a wrong address', function(done) {
    supertest(app.app)
      .get('/saray/abc/wrong')
      .expect(404)
      .end(done);
  });

  it('HTTP GET CORS call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .options('/saray/abc/call')
      .set('Origin', 'http://saray.example.com')
      .set('custom-header1', 'custom-value1')
      .set('custom-header2', 'custom-value2')
      .set('Access-Control-Request-Headers', 'custom-header1, custom-header2')
      .set('Access-Control-Request-Method', 'GET')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(
          response.headers['access-control-allow-headers'] === 'Origin, X-Requested-With, Content-Type, Accept, Authorization, custom-header1, custom-header2'
        );
        return done();
      });
  });

  it('HTTP GET call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/somepath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value');
        return done();
      });
  });

  it('HTTP POST call to a right address with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/somepath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/somepath/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/somepath/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath-POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/somepath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath');
        return done();
      });
  });

  it('HTTP POST call to a right address with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/somepath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/somepath/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/somepath/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JS stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/somepath/call/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JS stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/somepath/call/somesubpath/call2')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'somepath somesubpath POST');
        return done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JSON stubbed data', function(done) {
    supertest(app.app)
      .get('/saray/abc/somepath/call/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath-2');
        return done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JSON stubbed data', function(done) {
    supertest(app.app)
      .post('/saray/abc/somepath/call/somesubpath/call')
      .expect(200)
      .end(function(err, response) {
        assert.ok(!err);
        assert.ok(response.body.key === 'dynpath-value-subpath-2-POST');
        return done();
      });
  });
});

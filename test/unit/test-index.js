const assert = require('assert');
const utils = require('../../utils');
const corsMiddleware = require('../../middlewares/cors');

describe('Unit tests', function() {
  it('Should parse correctly URL parameters', function() {
    const rawParams = {
      param1: 'value1',
      param2: 'value2'
    };
    const paramsString = utils.getParamsString(rawParams);

    assert.equal(paramsString, 'param1=value1&param2=value2');
  });

  it('Should parse correctly empty URL parameters', function() {
    const rawParams = {};
    const paramsString = utils.getParamsString(rawParams);

    assert.strictEqual(paramsString, '');
    assert.notStrictEqual(paramsString, false);
  });

  it('Should generate correctly query string for GET calls', function() {
    const req = {
      method: 'GET',
      query: {
        param1: 'value1',
        param2: 'value2'
      }
    };
    const queryString = utils.getQueryString(req);

    assert.equal(queryString, '?param1=value1&param2=value2');
  });

  it('Should generate correctly query string for empty GET calls', function() {
    const req = {
      method: 'GET',
      query: {}
    };
    const queryString = utils.getQueryString(req);

    assert.equal(queryString, '');
  });

  it('Should generate correctly query string for POST calls', function() {
    const req = {
      method: 'POST',
      body: {
        param1: 'value1',
        param2: 'value2'
      }
    };
    const queryString = utils.getQueryString(req);
    assert.equal(queryString, '');
  });

  it('Should generate correctly query string for empty POST calls', function() {
    const req = {
      method: 'POST',
      body: {}
    };
    const queryString = utils.getQueryString(req);

    assert.equal(queryString, '');
  });

  it('Should strip correctly root path from filesystem path', function() {
    const path1 = utils.stripRootPath('/paolo', '/paolo/v1/me');
    const path2 = utils.stripRootPath('/paolo', '/v1/me/paolo');
    const path3 = utils.stripRootPath('/paolo', '/v1/paolo/me');
    assert.equal(path1, '/v1/me');
    assert.equal(path2, '/v1/me/paolo');
    assert.equal(path3, '/v1/paolo/me');
  });

  it('Should add correctly CORS custom headers to accepted headers', function() {
    const requestHeaders = 'custom-header1, custom-header2';
    const allowedHeaders = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    const finalExpectedHeaders = allowedHeaders + ', ' + requestHeaders;
    const finalComputedHeaders = corsMiddleware.updateCORSAllowedHeaders(requestHeaders, allowedHeaders);
    assert.equal(finalExpectedHeaders, finalComputedHeaders);
  });
});

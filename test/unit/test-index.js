const assert = require('assert');
const app = require('../../index');

describe('Unit tests', function() {
  it('Should parse correctly URL parameters', function() {
    const rawParams = {
      param1: 'value1',
      param2: 'value2'
    };
    const paramsString = app.getParamsString(rawParams);

    assert.equal(paramsString, 'param1=value1&param2=value2');
  });

  it('Should parse correctly empty URL parameters', function() {
    const rawParams = {};
    const paramsString = app.getParamsString(rawParams);

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
    const queryString = app.getQueryString(req);

    assert.equal(queryString, '?param1=value1&param2=value2');
  });

  it('Should generate correctly query string for empty GET calls', function() {
    const req = {
      method: 'GET',
      query: {}
    };
    const queryString = app.getQueryString(req);

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
    const queryString = app.getQueryString(req);

    assert.equal(queryString, '?param1=value1&param2=value2');
  });

  it('Should generate correctly query string for empty POST calls', function() {
    const req = {
      method: 'POST',
      body: {}
    };
    const queryString = app.getQueryString(req);

    assert.equal(queryString, '');
  });

  it('Should strip correctly root path from filesystem path', function() {
    const path1 = app.stripRootPath('/paolo', '/paolo/v1/me');
    const path2 = app.stripRootPath('/paolo', '/v1/me/paolo');
    const path3 = app.stripRootPath('/paolo', '/v1/paolo/me');
    assert.equal(path1, '/v1/me');
    assert.equal(path2, '/v1/me/paolo');
    assert.equal(path3, '/v1/paolo/me');
  });
});

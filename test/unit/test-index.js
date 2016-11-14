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
});

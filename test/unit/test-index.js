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
});

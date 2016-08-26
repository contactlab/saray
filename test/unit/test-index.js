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

  it('Should parse correctly command arguments', function() {
    const fakeArgv = ['param1=value1', 'param2=value2'];
    const value = app.getArgvValue(fakeArgv, 'param2', 'defaultValue');

    assert.strictEqual(value, 'value2');
  });

  it('Should parse correctly command arguments on undefined parameter', function() {
    const fakeArgv = ['param1=value1', 'param2=value2'];
    const value = app.getArgvValue(fakeArgv, 'param3', 'defaultValue');

    assert.strictEqual(value, 'defaultValue');
  });
});

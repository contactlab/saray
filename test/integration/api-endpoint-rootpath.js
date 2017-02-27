const assert = require('assert');
const fetch = require('node-fetch');

describe('Integration with api endpoint with rootpath', function() {
  it('HTTP GET call to a stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8085/saray/abc/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value');
        return done();
      });
  });

  it('HTTP GET call to a not stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8085/saray/abc/call1', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 404);
        return done();
      });
  });

  it('HTTP GET call to an address stubbed by the endpoint', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8085/saray/abc/call_endpoint', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint not stubbed by caller');
        return done();
      }).catch(function() {
        assert.ok(false);
        return done();
      });
  });

  it('HTTP GET call to an address not stubbed by the endpoint and by the caller', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8085/saray/abc/call_totally_wrong', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 404);
        return done();
      });
  });
});

describe('Integration with api endpoint with prefer api with rootpath', function() {
  it('HTTP GET call to a stubbed address by endpoint and caller', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8086/saray/abc/call', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint');
        return done();
      });
  });

  it('HTTP GET call to a stubbed address by caller', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8086/saray/abc/call3', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.keyWithParam, 'value');
        return done();
      });
  });

  it('HTTP GET call to a stubbed address by endpoint', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8086/saray/abc/call_endpoint', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint not stubbed by caller');
        return done();
      });
  });

  it('HTTP GET call to a not stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8085/saray/abc/call1', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 404);
        return done();
      });
  });

  it('HTTP GET call to an address stubbed by the caller and with network problems', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8090/saray/abc/call', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value');
        return done();
      }).catch(done);
  });

  it('HTTP GET call to a stubbed address by caller, with endpoint that returns a 401', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8085/saray/abc/call401', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value 401 stubbed');
        return done();
      });
  });
});
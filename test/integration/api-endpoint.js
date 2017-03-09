const assert = require('assert');
const fetch = require('node-fetch');

describe('Integration with api endpoint', function() {
  it('HTTP GET call to a stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8082/call', opts)
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

    fetch('http://localhost:8082/call1', opts)
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

    fetch('http://localhost:8082/call_endpoint', opts)
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

  it('HTTP GET call to an address not stubbed by the endpoint and by the caller', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8082/call_totally_wrong', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 404);
        return done();
      });
  });
});

describe('Integration with api endpoint and dynamic path', function() {
  it('HTTP GET call to a stubbed address with dynamic path', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8091/fakeudid/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'dynpath-value');
        return done();
      });
  });

  it('HTTP GET call to a stubbed existing address with dynamic path', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8091/realudid/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint path realudid');
        return done();
      });
  });

  it('HTTP GET call to a stubbed existing address with dynamic path using dynamic path string', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8091/_/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'dynpath-value');
        return done();
      });
  });

  it('HTTP GET call to a not existing address with dynamic path', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8091/fakeudid/wrong', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 404);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return done();
      });
  });
});

describe('Integration with api endpoint with prefer api', function() {
  it('HTTP GET call to a stubbed address by endpoint and caller', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8083/call', opts)
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
    fetch('http://localhost:8083/call3', opts)
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
    fetch('http://localhost:8083/call_endpoint', opts)
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

    fetch('http://localhost:8082/call1', opts)
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

    fetch('http://localhost:8089/call', opts)
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

  it('HTTP GET call to a stubbed address by caller, with endpoint that returns a 404', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8083/call404', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value 404 stubbed');
        return done();
      });
  });

  it('HTTP GET call to a not stubbed address with a param that contain valid JSON - ', function(done) {
    const opts = {
      method: 'GET'
    };

    const params = {
      date: '2017-09-07T16:11:46+0200'
    };
    const queryParams = encodeURIComponent(JSON.stringify(params));
    fetch('http://localhost:8083/jsonQueryString?param=' + queryParams, opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, { param: '{"date":"2017-09-07T16:11:46+0200"}' });
        return done();
      });
  });
});

describe('Integration with api endpoint with prefer api and dynamic path', function() {
  it('HTTP GET call to a stubbed address by endpoint and caller', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8092/realudid/call', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint path realudid');
        return done();
      });
  });

  it('HTTP GET call to a stubbed address by caller', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8092/somepath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'somepath');
        return done();
      });
  });

  it('HTTP GET call to a stubbed address by endpoint', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8092/realudid/call', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint path realudid');
        return done();
      });
  });

  it('HTTP GET call to a not stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8092/somepath/call1', opts)
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

    fetch('http://localhost:8092/somepath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'dynpath-value');
        return done();
      }).catch(done);
  });
});

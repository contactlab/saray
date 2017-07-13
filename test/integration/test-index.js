const assert = require('assert');
const path = require('path');
const fs = require('fs');
const app = require('../../src/index');
const utils = require('../../src/utils');
const fetch = require('node-fetch');


describe('Integration with dynamic path feature enabled', function() {
  it('HTTP GET call to a wrong address', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8095/somepath/wrong', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 404);
        done();
      });
  });

  it('HTTP GET CORS call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET',
      headers: {
        'Origin': 'http://saray.example.com',
        'custom-header1': 'custom-value1',
        'custom-header2': 'custom-value2',
        'Access-Control-Request-Headers': 'custom-header1, custom-header2',
        'Access-Control-Request-Method': 'GET'
      }
    };
    fetch('http://localhost:8095/somepath/call', opts)
      .then(function(response) {
        assert.ok(
          response.headers.get('access-control-allow-headers') === 'Origin, X-Requested-With, Content-Type, Accept, Authorization, custom-header1, custom-header2'
        );
        done();
      });
  });

  it('HTTP GET call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8095/somepath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value');
        done();
      });
  });

  it('HTTP POST call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8095/somepath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-POST');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8095/somepath/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8095/somepath/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath-POST');
        done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8095/somepath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath');
        done();
      });
  });

  it('HTTP POST call to a right address with JS stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8095/somepath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8095/somepath/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath with JS stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8095/somepath/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath POST');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8095/somepath/call/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JS stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8095/somepath/call/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath POST');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8095/somepath/call/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath-2');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8095/somepath/call/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath-2-POST');
        done();
      });
  });

  it('HTTP GET call to a wildcard with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8095/totallyrandomapi', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 404);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });
});

describe('Integration with dynamic path feature enabled', function() {

  it('HTTP GET call to a wrong address', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8096/saray/abc/somepath/wrong', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 404);
        done();
      });
  });

  it('HTTP GET CORS call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET',
      headers: {
        'Origin': 'http://saray.example.com',
        'custom-header1': 'custom-value1',
        'custom-header2': 'custom-value2',
        'Access-Control-Request-Headers': 'custom-header1, custom-header2',
        'Access-Control-Request-Method': 'GET'
      }
    };
    fetch('http://localhost:8096/somepath/call', opts)
      .then(function(response) {
        assert.ok(
          response.headers.get('access-control-allow-headers') === 'Origin, X-Requested-With, Content-Type, Accept, Authorization, custom-header1, custom-header2'
        );
        done();
      });
  });

  it('HTTP GET call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value');
        done();
      });
  });

  it('HTTP POST call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-POST');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8096/saray/abc/somepath/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8096/saray/abc/somepath/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath-POST');
        done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath');
        done();
      });
  });

  it('HTTP POST call to a right address with JS stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8096/saray/abc/somepath/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath with JS stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8096/saray/abc/somepath/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath POST');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JS stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call/somesubpath/call2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'somepath somesubpath POST');
        done();
      });
  });

  it('HTTP GET call to a right address with subpath 2 with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath-2');
        done();
      });
  });

  it('HTTP POST call to a right address with subpath 2 with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8096/saray/abc/somepath/call/somesubpath/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'dynpath-value-subpath-2-POST');
        done();
      });
  });
  
  it('HTTP GET call to a wildcard with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8096/saray/abc/totallyrandomapi', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 404);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });
});

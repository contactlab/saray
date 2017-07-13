const assert = require('assert');
const path = require('path');
const fs = require('fs');
const app = require('../../src/index');
const utils = require('../../src/utils');
const fetch = require('node-fetch');

describe('Integration with rootPath', function() {

  it('HTTP GET call to a wrong address', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/wrong', opts)
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
    fetch('http://localhost:8094/saray/abc/call', opts)
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
    fetch('http://localhost:8094/saray/abc/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'value');
        done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/call4', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'value');
        done();
      });
  });

  it('HTTP GET call to a right address with parameters with JSON stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/call?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.keyWithParam === 'value');
        done();
      });
  });

  it('HTTP GET call to a right address with parameters with JS stubbed data', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/call4?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.keyWithParam === 'value');
        done();
      });
  });

  it('HTTP GET call to a malformed JSON', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/malformed', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 500);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP POST call to a wrong address', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8094/saray/abc/wrong', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 404);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP POST call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8094/saray/abc/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.keyPOST === 'value');
        done();
      });
  });

  it('HTTP POST call to a right address with JS stubbed data', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8094/saray/abc/call4', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.keyPOST === 'value');
        done();
      });
  });

  it('HTTP POST call to a malformed JSON', function(done) {
    const opts = {
      method: 'POST'
    };
    fetch('http://localhost:8094/saray/abc/malformed', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 500);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP OPTIONS call to a wrong address', function(done) {
    const opts = {
      method: 'OPTIONS'
    };
    fetch('http://localhost:8094/saray/abc/generic/options', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 404);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP OPTIONS call to a right address with JSON stubbed data', function(done) {
    const opts = {
      method: 'OPTIONS'
    };
    fetch('http://localhost:8094/saray/abc/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP OPTIONS call to a right address with params with JSON stubbed data', function(done) {
    const opts = {
      method: 'OPTIONS'
    };
    fetch('http://localhost:8094/saray/abc/call2?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP OPTIONS call to a right address with params 2 with JSON stubbed data', function(done) {
    const opts = {
      method: 'OPTIONS'
    };
    fetch('http://localhost:8094/saray/abc/call3?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP OPTIONS call to a right address with JS stubbed data', function(done) {
    const opts = {
      method: 'OPTIONS'
    };
    fetch('http://localhost:8094/saray/abc/call4', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP OPTIONS call to a right address with params with JS stubbed data', function(done) {
    const opts = {
      method: 'OPTIONS'
    };
    fetch('http://localhost:8094/saray/abc/call5?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP OPTIONS call to a right address with params 2 with JS stubbed data', function(done) {
    const opts = {
      method: 'OPTIONS'
    };
    fetch('http://localhost:8094/saray/abc/call6?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data to an updated file', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/call6', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'value');
      });

    const strippedPath = utils.stripRootPath(app.rootPath, '/call6');
    const filePath = path.join(__dirname, '..', 'data', strippedPath + '.GET.js');
    const dataFile = fs.readFileSync(filePath);
    const dataFileContent = dataFile.toString();
    const dataFileContentReplaced = dataFileContent.replace('value', 'value2');
    fs.writeFileSync(filePath, dataFileContentReplaced);

    fetch('http://localhost:8094/saray/abc/call6', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'value2');

        const dataFileContentReplaced2 = dataFileContent.replace('value2', 'value');
        fs.writeFileSync(filePath, dataFileContentReplaced2);
        
        fetch('http://localhost:8094/saray/abc/call6', opts)
          .then(function(response) {
            assert.deepEqual(response.status, 200);
            assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
            return response.text();
          })
          .then(function(responseText) {
            const j = JSON.parse(responseText);
            assert.ok(j.key === 'value');
            done();
          });
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/jsFirst', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'valueJS');
        done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first with parameters', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/jsFirst?param1=valueParam', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'valueJSvalueParam');
        done();
      });
  });

  it('HTTP GET call to a right address with JS stubbed data that must be served first with parameters 2', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/jsFirst?param2=value2', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'valueJS with param 2');
        done();
      });
  });

  it('HTTP GET call to a right address with parameters with JSON stubbed data and a filesystem name compatible with Windows', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/call7?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'value windows compatible');
        done();
      });
  });

  it('HTTP GET call to a right address with parameters with JS stubbed data and a filesystem name compatible with Windows', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8094/saray/abc/call8?param1=value1', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(responseText) {
        const j = JSON.parse(responseText);
        assert.ok(j.key === 'value windows compatible');
        done();
      });
  });
});

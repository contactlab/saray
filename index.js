const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const portArgv = process.argv.filter(item => item.indexOf('port=') !== -1);
const port = portArgv[0] ? portArgv[0].split('=')[1] : 8081;

const apiDataPathArgv = process.argv.filter(item => item.indexOf('path=') !== -1);
const apiDataPath = apiDataPathArgv[0] ? apiDataPathArgv[0].split('=')[1] : path.join(__dirname, 'data');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

function getParamsString(rawParams) {
  let params = Object.keys(rawParams).reduce((acc, cur) => {
    acc += cur + '=' + rawParams[cur] + '&';
    return acc;
  }, '?');

  if (params) {
    params = params.substring(0, params.length - 1);
  }

  return params;
}

app.all('/*', function(req, res) {
  let rawParams = {};

  if (req.method === 'GET') {
    rawParams = req.query
  } else if (req.method === 'POST') {
    rawParams = req.body;
  }

  const params = getParamsString(rawParams);

  console.info('HTTP ' + req.method + ' ' + req.path + ' ' + params);

  const filePath = path.join(apiDataPath, req.path + params + '.' + req.method + '.json');
  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.status(404).send('Probably this is not the API response you are looking for');
      return;
    }
    var obj = JSON.parse(data);
    res.json(obj);
  });
});

app.listen(port, function() {
  console.log('ContactLab API stubber listening on port ' + port + ' using path ' + apiDataPath);
});

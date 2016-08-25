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

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

function getParamsString(rawParams) {
  return Object.keys(rawParams)
    .reduce((acc, cur) => {
      acc.push(cur + '=' + rawParams[cur]);
      return acc;
    }, [])
    .join('&');
}

app.all('/*', function(req, res) {
  let rawParams = {};

  if (req.method === 'GET') {
    rawParams = req.query
  } else if (req.method === 'POST') {
    rawParams = req.body;
  }

  const paramString = getParamsString(rawParams);
  const params = paramString !== '' ? '?' + paramString : '';

  console.info('HTTP ' + req.method + ' ' + req.path + ' ' + params);

  if (req.method === 'OPTIONS') {
    res.json({});
    return;
  }

  const filePath = path.join(apiDataPath, req.path + params + '.' + req.method + '.json');
  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.status(404).json({
        error: 'Probably this is not the API response you are looking for, missing JSON file for ' + req.path
      });
      return;
    }
    try {
      var obj = JSON.parse(data);
    } catch (e) {
      if (e instanceof SyntaxError) {
        res.status(500).json({
          error: 'Hey, check your JSON for stubbed API at path ' + req.path + ' , probably it\'s malformed!'
        });
      } else {
        res.status(500).json({
          error: 'I\'m sorry, something went wrong!'
        });
      }
    }
    res.json(obj);
  });
});

app.listen(port, function() {
  console.log('ContactLab API stubber listening on port ' + port + ' using path ' + apiDataPath);
});

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

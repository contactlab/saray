var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

const portArgv = process.argv.filter(item => item.indexOf('port=') !== -1);
const port = portArgv[0] ? portArgv[0].split('=')[1] : 8081;

const apiDataPathArgv = process.argv.filter(item => item.indexOf('path=') !== -1);
const apiDataPath = apiDataPathArgv[0] ? apiDataPathArgv[0].split('=')[1] : path.join(__dirname, 'data');

app.all('/*', function(req, res) {
  console.info('HTTP ' + req.method + ' ' + req.path);

  let params = '';

  // qui gestisco solo gli URL parameters. Per la gestione dei parametri nel body,
  // ad esempio per le POST, bisogna gestire la cosa con body-parser
  Object.keys(req.query).forEach(item => {
    params += item + '=' + req.query[item] + '&';
  });
  if (params.length > 0) {
    params = '?' + params.substring(0, params.length - 1);
  }

  const filePath = path.join(apiDataPath, req.path + params + '.' + req.method + '.json');
  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.status(404).send('Probably this is not the API response you are looking for');
      return;
    }
    var obj = JSON.parse(data);
    res.send(obj);
  });
});

app.listen(port, function() {
  console.log('ContactLab API stubber listening on port ' + port + ' using path ' + apiDataPath);
});

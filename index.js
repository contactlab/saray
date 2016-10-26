#! /usr/bin/env node

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const program = require('commander');

const allowedMethods = ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'];
const DEFAULT_PORT = 8081;
const DEFAULT_PATH = path.join(__dirname, 'data');

program
  .version('1.1.1')
  .description("Yet Another Rest API Stubber'.split(' ').reverse().map(item => item[0].toLowerCase()).join('')")
  .option('--port <port>', 'The port to listen to', DEFAULT_PORT)
  .option('--path <password>', 'The path for stubbed data', DEFAULT_PATH)
  .parse(process.argv);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

const port = program.port;
module.exports.port = port;

const apiDataPath = program.path;
module.exports.apiDataPath = apiDataPath;

/**
 * Parse an HTTP parameters object and convert it into a query string
 *
 * @param  {Object} rawParams HTTP parameters object
 * @return {string}           the query string
 */
const getParamsString = function(rawParams) {
  return Object.keys(rawParams)
    .reduce((acc, cur) => {
      acc.push(cur + '=' + rawParams[cur]);
      return acc;
    }, [])
    .join('&');
};
module.exports.getParamsString = getParamsString;

app.all('/*', function(req, res) {
  let rawParams = {};

  // GET and POST parameters object are the same, but they are in different
  // request properties
  if (req.method === 'GET') {
    rawParams = req.query
  } else if (req.method === 'POST') {
    rawParams = req.body;
  }

  const paramString = getParamsString(rawParams);
  const params = paramString !== '' ? '?' + paramString : '';

  console.info('HTTP ' + req.method + ' ' + req.path + ' ' + params);

  if (req.method === 'OPTIONS') {
    let methods = [];
    allowedMethods.forEach(function(method) {
      let filePath = path.join(module.exports.apiDataPath, req.path + params + '.' + method + '.json');
      if(fs.existsSync(filePath)) {
        methods.push(method);
      }
    });
    if(methods.length) {
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
      res.send(methods);
    } else {
      res.setHeader('Access-Control-Allow-Methods', '');
      res.status(404).send();
    }
    return;
  }

  const filePath = path.join(module.exports.apiDataPath, req.path + params + '.' + req.method + '.json');
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
  console.log('ContactLab API stubber listening on port ' + port + ' using path ' + module.exports.apiDataPath);
});

module.exports.app = app;

#! /usr/bin/env node

const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const program = require('commander');

const app = express();

const allowedMethods = ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'];
const DEFAULT_PORT = 8081;
const DEFAULT_PATH = path.join(__dirname, 'data');
const DEFAULT_LOG_PATH = path.join(__dirname, 'saray.log');

program
  .version('1.3.0')
  .description("'Yet Another Rest API Stubber'.split(' ').reverse().map(item => item[0].toLowerCase()).join('')")
  .option('--port <port>', 'The port to listen to (default: 8081)', DEFAULT_PORT)
  .option('--path <password>', 'The path for stubbed data (default ./data)', DEFAULT_PATH)
  .option('--endpoint <endpoint>', 'The endpoint (default null)', null)
  .option('--pfer-api, --prefer-api', 'Prefer API enpoint to stubbed data (default: false)', false)
  .option('--log <log_path>', 'Log file path', DEFAULT_LOG_PATH)
  .parse(process.argv);

const log = bunyan.createLogger({
  name: 'saray',
  streams: [{
    path: program.log,
  }]
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

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

function getQueryString(req) {
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
  return params;
}
module.exports.getQueryString = getQueryString;

function reallyAllowedMethods(req, params) {
  return allowedMethods.filter(function(method) {
    const filePath = path.join(module.exports.apiDataPath, req.path + params + '.' + method + '.json');
    if(fs.existsSync(filePath)) {
      return method;
    }
  });
}
module.exports.reallyAllowedMethods = reallyAllowedMethods;

app.use(function(req, res, next) {
  const endpoint = program.endpoint;

  if (endpoint !== null) {
    const params = getQueryString(req);
    const allowedMethods = reallyAllowedMethods(req, params);
    if (allowedMethods.length && !program.preferApi) {
      res.set('Saray-Stubbed', true);
      log.info(`Stubbing API call ${req.method} ${req.path} ${params}`);
      next();
    } else {
      res.set('Saray-Stubbed', false);
      log.info(`Not stubbing API call ${req.method} ${req.path} ${params}`);

      const headers = Object.assign({}, req.headers);
      delete headers.host;
      const opts = {
        method: req.method,
        headers: headers
      };

      if (req.method === 'POST' || req.method === 'PATCH') {
        opts.body = JSON.stringify(req.body);
      }

      log.info(`Fetching API call ${req.method} ${req.path} from ${endpoint}`);
      fetch(endpoint + req.path, opts).then(function(response) {
        const contentType = response.headers.get('content-type');
        if (contentType) {
          res.set('Content-type', response.headers.get('content-type'));
        }
        log.info(`Fetched API call ${req.method} ${req.path} from ${endpoint} with status ${response.status}`);
        return response.text();
      }).then(function(text) {
        res.send(text);
      }).catch(function(response) {
        log.info(`Error with API call ${req.method} ${req.path} from ${endpoint}`);
        res.sendStatus(404);
      });
    }
  } else {
    res.set('Saray-Stubbed', true);
    log.info(`Stubbing API call ${req.method} ${req.path} with no endpoint specified`);
    next();
  }
});

const port = program.port;
module.exports.port = port;

const apiDataPath = program.path;
module.exports.apiDataPath = apiDataPath;

app.all('/*', function(req, res) {
  const params = getQueryString(req);

  if (req.method === 'OPTIONS') {
    const methods = reallyAllowedMethods(req, params);
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
  log.info(`Loading data from ${filePath}`);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      log.error(`${filePath} doen not exist`);
      log.error(err);
      res.status(404).json({
        error: 'Probably this is not the API response you are looking for, missing JSON file for ' + req.path
      });
      return;
    }

    try {
      var obj = JSON.parse(data);
    } catch (e) {
      if (e instanceof SyntaxError) {
        log.error(`Hey, check your JSON for stubbed API at path ${req.path} , probably it\'s malformed!`);
        res.status(500).json({
          error: `Hey, check your JSON for stubbed API at path ${req.path} , probably it\'s malformed!`
        });
      } else {
        log.error(e);
        res.status(500).json({
          error: 'I\'m sorry, something went wrong!'
        });
      }
    }

    res.json(obj);
  });
});

app.listen(port, function() {
  let message = 'ContactLab API stubber listening on port ' + port + '\nreading from path ' + module.exports.apiDataPath;
  if (program.endpoint) {
    message += '\nusing endpoint ' + program.endpoint;
  }
  if (program.preferApi) {
    message += '\npreferring API endpoint over stub';
  } else {
    message += '\npreferring stub over API endpoint';
  }
  console.log(message);
  log.info(message);
});

module.exports.app = app;

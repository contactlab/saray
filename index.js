#! /usr/bin/env node

const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const express = require('express');
const fs = require('fs');
const path = require('path');
const process = require('process');
const program = require('commander');

const utils = require('./utils');
const corsMiddleware = require('./middlewares/cors').cors;

const app = express();

const DEFAULT_PORT = 8081;
const DEFAULT_PATH = path.join(process.cwd(), 'data');
const DEFAULT_LOG_PATH = path.join(__dirname, 'saray.log');
const DEFAULT_ROOT_PATH = '';

program
  .version('1.6.0-pfer-api-fix')
  .description('\'Yet Another Rest API Stubber\'.split(\' \').reverse().map(item => item[0].toLowerCase()).join(\'\')')
  .option('--port <port>', 'The port to listen to (default: 8081)', DEFAULT_PORT)
  .option('--path <password>', 'The path for stubbed data (default ./data)', DEFAULT_PATH)
  .option('--endpoint <endpoint>', 'The endpoint (default null)', null)
  .option('--pfer-api, --prefer-api', 'Prefer API enpoint to stubbed data (default: false)', false)
  .option('--log <log_path>', 'Log file path', DEFAULT_LOG_PATH)
  .option('--root <root_path>', 'The base root path (default: empty)', DEFAULT_ROOT_PATH)
  .parse(process.argv);

const log = bunyan.createLogger({
  name: 'saray',
  streams: [{
    path: program.log,
  }]
});
module.exports.log = log;

const rootPath = program.root;
module.exports.rootPath = rootPath;

const sarayRouter = express.Router();
module.exports.sarayRouter = sarayRouter;

const port = program.port;
module.exports.port = port;

const apiDataPath = path.resolve(program.path);
module.exports.apiDataPath = apiDataPath;

module.exports.endpoint = program.endpoint;
module.exports.preferApi = program.preferApi;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(corsMiddleware);

const endpointMiddleware = require('./middlewares/endpoint')(
  log,
  module.exports.endpoint,
  module.exports.preferApi,
  module.exports.apiDataPath,
  module.exports.rootPath);
app.use(endpointMiddleware);

function loadJSFile(filePath, req, res, log, next) {
  log.info(`Loading data from ${filePath}`);
  delete require.cache[filePath];  // we neeed this to reload JS file after every edit
  const jsParsed = require(filePath);
  jsParsed(req, res, log, next);
}

function loadJSONFile(filePath, req, res, log) {
  log.info(`Loading data from ${filePath}`);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      log.error(`${filePath} does not exist`);
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
}

sarayRouter.all('/*', function(req, res, next) {
  const params = utils.getQueryString(req);

  if (req.method === 'OPTIONS') {
    const methods = utils.reallyAllowedMethods(
      req,
      params,
      module.exports.apiDataPath,
      module.exports.rootPath
    );

    if (methods.length) {
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
      res.send(methods);
    } else {
      res.setHeader('Access-Control-Allow-Methods', '');
      res.status(404).send();
    }
    return;
  }

  const strippedPath = utils.stripRootPath(module.exports.rootPath, req.path);
  const jsonFilePath = path.join(module.exports.apiDataPath, strippedPath + params + '.' + req.method + '.json');
  const jsFilePath = path.join(module.exports.apiDataPath, strippedPath + '.' + req.method + '.js');
  const jsFilePathWithParams = path.join(module.exports.apiDataPath, strippedPath + params + '.' + req.method + '.js');

  if (fs.existsSync(jsFilePathWithParams)) {
    loadJSFile(jsFilePathWithParams, req, res, log, next);
  } else if (fs.existsSync(jsFilePath)) {
    loadJSFile(jsFilePath, req, res, log, next);
  } else if (fs.existsSync(jsonFilePath)) {
    loadJSONFile(jsonFilePath, req, res, log);
  } else {
    log.error('Probably this is not the API response you are looking for, missing JSON file for ' + req.path);
    res.status(404).json({
      error: 'Probably this is not the API response you are looking for, missing JSON file for ' + req.path
    });
    return;
  }
});

app.use(module.exports.rootPath, sarayRouter);

function checkVersion() {
  const version = parseFloat(process.version.replace('v', ''));

  if (version < 6) {
    log.info('Your Node.js version is not supported. You must install Node.js >= 6.0');
    return false;
  }

  return true;
}

function startExpressServer() {
  app.listen(port, function() {
    log.info(
      'ContactLab API stubber listening on port ' + port +
      ' reading from path ' + module.exports.apiDataPath +
      ' using base path ' + module.exports.rootPath
    );

    if (module.exports.endpoint) {
      log.info('using endpoint ' + module.exports.endpoint);
    }

    if (module.exports.preferApi) {
      log.info('preferring API endpoint over stub');
    } else {
      log.info('preferring stub over API endpoint');
    }
  });
}

function main() {
  if (!checkVersion) {
    return;
  }

  startExpressServer();
}

main();

module.exports.app = app;

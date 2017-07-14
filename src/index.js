#! /usr/bin/env node

const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const express = require('express');
const fs = require('fs');
const path = require('path');
const process = require('process');
const program = require('commander');
const bformat = require('bunyan-format');

const utils = require('./utils');
const corsMiddleware = require('./middlewares/cors').cors;

const app = express();

const DEFAULT_PORT = 8081;
const DEFAULT_PATH = path.join(process.cwd(), 'data');
const DEFAULT_LOG_PATH = path.resolve('saray.log');
const DEFAULT_ROOT_PATH = '';
const DEFAULT_DYNPATH_STR = null;
const DEFAULT_TIMEOUT = 60000;

program
  .version('1.7.3')
  .description('\'Yet Another Rest API Stubber\'.split(\' \').reverse().map(item => item[0].toLowerCase()).join(\'\')')
  .option('--port <integer>', 'The port to listen to (default: 8081)', DEFAULT_PORT)
  .option('--path <string>', 'The path for stubbed data (default ./data)', DEFAULT_PATH)
  .option('--endpoint <string>', 'The endpoint (default null)', null)
  .option('--pfer-api, --prefer-api', 'Prefer API enpoint to stubbed data (default: false)', false)
  .option('--log <string>', 'Log file path (default: working directory)', DEFAULT_LOG_PATH)
  .option('--root <string>', 'The base root path (default: empty)', DEFAULT_ROOT_PATH)
  .option('--dynpath <string>', 'The string used as dynamic folder/file in path. Feature disabled with unset option (default: null)', DEFAULT_DYNPATH_STR)
  .option('--timeout <milliseconds>', 'The timeout to wait for endpoint before Saray respond with an HTTP 408', DEFAULT_TIMEOUT)
  .parse(process.argv);

const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({
  name: 'saray',
  streams: [
    // {
    //   level: 'info',
    //   stream: formatOut
    // },
    {
      path: program.log,
    }
  ]
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

const dynPath = program.dynpath;
module.exports.dynPath = dynPath;

const timeout = program.timeout;
module.exports.timeout = timeout;

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
  module.exports.rootPath,
  module.exports.timeout);
app.use(endpointMiddleware);

const main = require('./middlewares/main')(
  log,
  module.exports.dynPath,
  module.exports.apiDataPath,
  module.exports.rootPath
);
sarayRouter.all('/*', main);

app.use(module.exports.rootPath, sarayRouter);

function checkVersion() {
  const version = parseFloat(process.version.replace('v', ''));

  if (version < 6) {
    log.info('Your Node.js version is not supported. You must install Node.js >= 6.0');
    return false;
  }

  return true;
}

function runExpressServer() {
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

function run() {
  if (!checkVersion) {
    return;
  }

  runExpressServer();
}

run();

module.exports.app = app;

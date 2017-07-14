const fs = require('fs');
const path = require('path');

const utils = require('../utils');
const loadJSONFile = require('../loaders/json');
const loadJSFile = require('../loaders/javascript');
const seekFileFallback = require('../loaders/dynamic');

function mainModule(log, dynPath, apiDataPath, rootPath) {
  return function main(req, res, next) {
    const params = utils.getQueryString(req);

    if (dynPath) {
      req.dynamicPathParams = [];
    }

    if (req.method === 'OPTIONS') {
      const methods = utils.reallyAllowedMethods(
        req,
        params,
        apiDataPath,
        rootPath
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

    const strippedPath = utils.stripRootPath(rootPath, req.path);
    const jsonFilePath = path.join(apiDataPath, strippedPath + params + '.' + req.method + '.json');
    const jsFilePath = path.join(apiDataPath, strippedPath + '.' + req.method + '.js');
    const jsFilePathWithParams = path.join(apiDataPath, strippedPath + params + '.' + req.method + '.js');
    const encodedJsFileWithParams = utils.encodeFilePath(jsFilePathWithParams);
    const encodedJsonFilePath = utils.encodeFilePath(jsonFilePath);

    let filePath = null;

    if (fs.existsSync(jsFilePathWithParams)) {
      loadJSFile(jsFilePathWithParams, req, res, log, next);
    } else if (fs.existsSync(encodedJsFileWithParams)) {
      loadJSFile(encodedJsFileWithParams, req, res, log, next);
    } else if (fs.existsSync(jsFilePath)) {
      loadJSFile(jsFilePath, req, res, log, next);
    } else if (fs.existsSync(jsonFilePath)) {
      loadJSONFile(jsonFilePath, req, res, log);
    } else if (fs.existsSync(encodedJsonFilePath)) {
      loadJSONFile(encodedJsonFilePath, req, res, log);
    } else if (dynPath && ( filePath = seekFileFallback(
          apiDataPath,
          strippedPath,
          dynPath,
          req,
          'js',
          params
        ))) {
      loadJSFile(filePath, req, res, log, next);
    } else if (dynPath && (filePath = seekFileFallback(
          apiDataPath,
          strippedPath,
          dynPath,
          req,
          'js',
          ''
        ))) {
      loadJSFile(filePath, req, res, log, next);
    } else if (dynPath && (filePath = seekFileFallback(
          apiDataPath,
          strippedPath,
          dynPath,
          req,
          'json',
          params
        ))) {
      loadJSONFile(filePath, req, res, log);
    } else {
      const code = utils.handleErrorStatusCode(res.statusCode);
      const message = utils.handleErrorMessage(code, req.path);
      log.error(message);
      res.status(code).json({
        error: message
      });
      return;
    }
  };
}

module.exports = mainModule;
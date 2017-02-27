const utils = require('../utils');
const fetch = require('node-fetch');

function middleware(log, endpoint, preferApi, apiDataPath, rootPath) {
  return function endpointMiddleware(req, res, next) {
    if (endpoint !== null) {
      log.info('Endpoint is not null');
      const params = utils.getQueryString(req);
      const allowedMethods = utils.reallyAllowedMethods(
        req,
        params,
        apiDataPath,
        rootPath
      );
      if (allowedMethods.length && !preferApi) {
        res.set('Saray-Stubbed', true);
        log.info(`Stubbing API call ${req.method} ${req.path} ${params}`);
        next();
      } else {
        const headers = Object.assign({}, req.headers);
        delete headers.host;
        const opts = {
          method: req.method,
          headers: headers
        };

        if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
          opts.body = JSON.stringify(req.body);
        }

        const strippedPath = utils.stripRootPath(rootPath, req.path);
        log.info(`Fetching API call ${req.method} ${strippedPath} from ${endpoint}`);
        fetch(endpoint + strippedPath + params, opts).then(function(response) {
          if (response.status === 404 || response.status === 405) {
            res.set('Saray-Stubbed', true);
            log.info(`The API returned an HTTP ${response.status} - Stubbing API call ${req.method} ${req.path} ${params}`);
            next();
            return null;
          }
          res.set('Saray-Stubbed', false);
          log.info(`Not stubbing API call ${req.method} ${req.path} ${params}`);

          const contentType = response.headers.get('content-type');
          if (contentType) {
            res.set('Content-type', response.headers.get('content-type'));
          }
          log.info(`Fetched API call ${req.method} ${strippedPath} from ${endpoint} with status ${response.status}`);
          res.status(response.status);
          return response.text();
        }).then(function(text) {
          if (text !== null) {
            res.send(text);
          }
        }).catch(function() {
          log.info(`Error with API call ${req.method} ${req.path} from ${endpoint}`);
          res.set('Saray-Stubbed', true);
          log.info(`There was a network error through the endpoint - Stubbing API call ${req.method} ${req.path} ${params}`);
          next();
          return null;
        });
      }
    } else {
      res.set('Saray-Stubbed', true);
      log.info(`Stubbing API call ${req.method} ${req.path} with no endpoint specified`);
      next();
    }
  };
}

module.exports = middleware;

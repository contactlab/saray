const utils = require('../utils');

function middleware(log, endpoint, preferApi) {
  return function endpointMiddleware(req, res, next) {
    if (endpoint !== null) {
      const params = utils.getQueryString(req);
      const allowedMethods = utils.reallyAllowedMethods(
        req,
        params,
        module.exports.apiDataPath,
        module.exports.rootPath
      );
      if (allowedMethods.length && !preferApi) {
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

        const strippedPath = utils.stripRootPath(module.exports.rootPath, req.path);
        log.info(`Fetching API call ${req.method} ${strippedPath} from ${endpoint}`);
        fetch(endpoint + strippedPath, opts).then(function(response) {
          const contentType = response.headers.get('content-type');
          if (contentType) {
            res.set('Content-type', response.headers.get('content-type'));
          }
          log.info(`Fetched API call ${req.method} ${strippedPath} from ${endpoint} with status ${response.status}`);
          res.status(response.status);
          return response.text();
        }).then(function(text) {
          res.send(text);
        }).catch(function() {
          log.info(`Error with API call ${req.method} ${req.path} from ${endpoint}`);
          res.sendStatus(404);
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
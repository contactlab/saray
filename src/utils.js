const path = require('path');
const fs = require('fs');

const allowedMethods = ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'];

/**
 * Parse an HTTP parameters object and convert it into a query string
 *
 * @param  {Object} rawParams HTTP parameters object
 * @return {string}           the query string
 */
const getParamsString = function(rawParams) {
  return Object.keys(rawParams)
    .reduce((acc, cur) => {
      acc.push(cur + '=' + encodeURIComponent(rawParams[cur]));
      return acc;
    }, [])
    .join('&');
};

const getQueryString = function(req) {
  let rawParams = {};

  // GET and POST parameters object are the same, but they are in different
  // request properties
  // if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'POST') {
  rawParams = req.query || {};
  // }

  const paramString = getParamsString(rawParams);
  const params = paramString !== '' ? '?' + paramString : '';
  return params;
};

const stripRootPath = function(rootPath, requestPath) {
  const regexp = new RegExp('^' + rootPath);
  return requestPath.replace(regexp, '');
};

const reallyAllowedMethods = function(req, params, apiDataPath, rootPath) {
  return allowedMethods.filter(function(method) {
    const strippedPath = stripRootPath(rootPath, req.path);

    // Here we need to consider paths that have both parameters and not
    const filePaths = [
      path.join(apiDataPath, strippedPath + params + '.' + method + '.json'),
      path.join(apiDataPath, strippedPath + '.' + method + '.json'),
      path.join(apiDataPath, strippedPath + params + '.' + method + '.js'),
      path.join(apiDataPath, strippedPath + '.' + method + '.js')
    ];

    return filePaths.reduce(function(acc, cur) {
      if(fs.existsSync(cur)) {
        return method;
      } else {
        return acc;
      }
    }, '');
  });
};

const encodeFilePath = function(filePath) {
  const baseName = path.basename(filePath);
  return path.join(path.dirname(filePath), encodeURIComponent(baseName));
};

const errorStatusCodesMap = {
  '200': 404,
  '408': 408
};

function handleErrorStatusCode(code) {
  return errorStatusCodesMap[code.toString()];
}

function handleErrorMessage(code, extra) {
  const errorMessageStatusCodeMap = {
    '404': `Probably this is not the API response you are looking for, missing JSON file for ${extra}`,
    '408': `Timeout for API call ${extra}`
  };

  return errorMessageStatusCodeMap[code];
}

module.exports = {
  allowedMethods: allowedMethods,
  getParamsString: getParamsString,
  getQueryString: getQueryString,
  reallyAllowedMethods: reallyAllowedMethods,
  stripRootPath: stripRootPath,
  encodeFilePath: encodeFilePath,
  errorStatusCodesMap: errorStatusCodesMap,
  handleErrorStatusCode: handleErrorStatusCode,
  handleErrorMessage: handleErrorMessage
};

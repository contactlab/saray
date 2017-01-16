const utils = require('../utils');

function updateCORSAllowedHeaders (req, allowedHeaders) {
  const requestHeaders = req.get('Access-Control-Request-Headers');
  if (requestHeaders) {
    allowedHeaders += ', ' + requestHeaders;
  }
  return allowedHeaders;
}

function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', utils.allowedMethods.join(', '));

  const allowedHeaders = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  res.setHeader('Access-Control-Allow-Headers', updateCORSAllowedHeaders(req, allowedHeaders));

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
}

module.exports = cors;

function loadJSFile(filePath, req, res, log, next) {
  log.info(`Loading data from ${filePath}`);
  delete require.cache[filePath];  // we neeed this to reload JS file after every edit
  const jsParsed = require(filePath);
  jsParsed(req, res, log, next);
}

module.exports = loadJSFile;
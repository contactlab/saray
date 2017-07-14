const fs = require('fs');

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

module.exports = loadJSONFile;
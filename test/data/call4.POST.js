const path = require('path');
const fs = require('fs');

module.exports = function(req, res, log, next) {
  const file = fs.readFileSync(path.join(__dirname, 'call4.POST.json'));
  const jsonData = JSON.parse(file);
  const response = Object.getOwnPropertyNames(req.body).length > 0 ? req.body : jsonData;
  res.json(response);
};
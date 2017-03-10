module.exports = function(req, res, log, next) {
  res.json({
    key: req.dynamicPathParams.join(' ')
  });
};

module.exports = function(req, res, log, next) {
  setTimeout(function() {
    res.json({key: 'value'});
  }, 1000000);
};

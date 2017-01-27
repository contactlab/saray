module.exports = function(req, res, log, next) {
  if (req.query.param1) {
    res.json({key: 'valueJS' + req.query.param1});
  } else if (req.query.param2) {
    res.json({key: 'valueJS' + req.query.param2});
  } else {
    res.json({key: 'valueJS'});
  }
};
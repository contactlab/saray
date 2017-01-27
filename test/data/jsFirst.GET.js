module.exports = function(req, res, log, next) {
  if (req.query.param1) {
    res.json({key: 'valueJS' + req.query.param1});    
  } else {
    res.json({key: 'valueJS'});
  }
};
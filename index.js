module.exports = function connectSlowConfig(options) {
  options = options || {};
  options.delay = options.delay || 1000;
  return function connectSlow(req, res, next) {
    next();
  };
};
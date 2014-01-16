module.exports = function connectSlowConfig(options) {
  options = options || {};
  options.delay = options.delay || 1000;
  if (options.delay < 1) {
    throw new Error('Delay should be positive number, not ' + options.delay);
  }
  return function connectSlow(req, res, next) {
    setTimeout(next, options.delay);
  };
};
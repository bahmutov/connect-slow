var isRegExp = require('lodash.isregexp');
module.exports = function connectSlowConfig(options) {
  options = options || {};
  if (options.url) {
    if (!isRegExp(options.url)) {
      throw new Error('url should be a RegExp to check request url, not ' + options.url);
    }
  }

  options.delay = options.delay || 1000;
  if (options.delay < 1) {
    throw new Error('Delay should be positive number, not ' + options.delay);
  }

  return function connectSlow(req, res, next) {
    if (options.url) {
      if (options.url.test(req.url)) {
        // slow specific resoures down
        setTimeout(next, options.delay);
      } else {
        next();
      }
    } else {
      // slow everything down
      setTimeout(next, options.delay);
    }
  };
};
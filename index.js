var isRegExp = require('lodash.isregexp'),
    parseUrl = require('url').parse;

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

  // Return the query delay if it makes sense for this request, else undefined
  function getQueryDelay(url) {
    var delay;
    if (options.delayQueryParam) {
      var parsedUrl = parseUrl(url, true),
          queryDelay = parseInt(parsedUrl.query[options.delayQueryParam]);

      if (queryDelay > 1) {
        delay = queryDelay;
      }
    }

    return delay;
  }

  // Return the url delay if it makes sense for this request, else undefined
  function getUrlDelay(url) {
    var delay;
    if (options.url && !options.url.test(url)) {
      delay = 0;
    }

    return delay;
  }

  function getDelay(url) {
    var delay = getQueryDelay(url);
    if (delay === undefined) {
      delay = getUrlDelay(url);
    }

    if (delay === undefined) {
      delay = options.delay;
    }

    return delay;
  }

  return function connectSlow(req, res, next) {
    var delay = getDelay(req.url);
    if (delay && delay > 0) {
      setTimeout(next, delay);
    } else {
      next();
    }
  };
};
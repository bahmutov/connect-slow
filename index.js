var isRegExp = require('lodash.isregexp'),
    parseUrl = require('url').parse;

module.exports = function connectSlowConfig(options) {
  options = options || {};
  if (options.url) {
    if (!isRegExp(options.url)) {
      throw new Error('url should be a RegExp to check request url, not ' + options.url);
    }
  }

  if (options.delay === undefined) {
    options.delay = 1000;
  }
  if (options.delay < 0) {
    throw new Error('Delay should be positive number, not ' + options.delay);
  }

  // Return the query delay if it makes sense for this request, else undefined
  function getQueryDelay(url) {
    var delay;
    if (options.delayQueryParam) {
      var parsedUrl = parseUrl(url, true);

      if (parsedUrl.query && parsedUrl.query[options.delayQueryParam]) {
        var queryDelay = parseInt(parsedUrl.query[options.delayQueryParam]);
        if (queryDelay > 0) {
          delay = queryDelay;
        }
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
    if (delay !== undefined && delay > 0) {
      if (options.debug) {
        console.log('Connect-slow: delaying %s ms on url %s', delay, req.url);
      }
      setTimeout(next, delay);
    } else {
      next();
    }
  };
};

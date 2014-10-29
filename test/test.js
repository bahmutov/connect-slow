/*global gt:false*/
var connect = require('connect');
var q = require('q');
var request = q.denodeify(require('request'));
var http = require('http');
var slow = require('..');

var port = 3440;
var msg = 'hello world';
var url = 'http://localhost:' + port + '/something';

function sendMessage(req, res) {
  res.end(msg);
}

gt.module('connect-slow default options tests', {
  setupOnce: function () {
    var app = connect()
    .use(connect.logger('dev'))
    .use(slow())
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  },
  teardownOnce: function () {
    this.server.close();
    delete this.server;
  }
});

gt.async('slow everything down', function () {
  var start = new Date();
  request(url)
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 1000, 'server responded in', ms, 'not in 1000ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.module('connect-slow some resources', {
  setupOnce: function () {
    var app = connect()
    .use(connect.logger('dev'))
    .use(slow({
      url: /\.slow$/i,
      delay: 500
    }))
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  },
  teardownOnce: function () {
    this.server.close();
    delete this.server;
  }
});

gt.async('.slow requests are slow', function () {
  var start = new Date();
  request(url + '/foo.slow')
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 500, 'server responded in', ms, 'not in 500ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.async('other requests are still fast', function () {
  var start = new Date();
  request(url + '/foo.html')
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 0 && ms < 150, 'server responded in', ms);
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.module('connect-slow query parameter', {
  setupOnce: function () {
    var app = connect()
    .use(connect.logger('dev'))
    .use(slow({
      delay: 800,
      delayQueryParam: 'slow'
    }))
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  },
  teardownOnce: function () {
    this.server.close();
    delete this.server;
  }
});

gt.async('slow down requests with the query param by the given delay', function () {
  var start = new Date(),
      delay = 400;
  request(url + '?slow=' + delay)
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= delay && ms < delay + 200, 'server responded in', ms, 'not in ' +
          delay + ' to ' + (delay + 200) + 'ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.async('other requests use default options', function () {
  var start = new Date();
  request(url)
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 800, 'server responded in', ms, 'not in 800ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.module('connect-slow query parameter and url regex', {
  setupOnce: function () {
    var app = connect()
    .use(connect.logger('dev'))
    .use(slow({
      url: /\.slow$/,
      delayQueryParam: 'slow'
    }))
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  },
  teardownOnce: function () {
    this.server.close();
    delete this.server;
  }
});

gt.async('.slow requests with the query param use the query delay', function () {
  var start = new Date(),
      delay = 400;
  request(url + '/foo.slow?slow=' + delay)
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= delay && ms < delay + 200, 'server responded in', ms, 'not in ' +
          delay + ' to ' + (delay + 200) + 'ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.async('.slow requests without the query param use the default delay', function () {
  var start = new Date();
  request(url + '/foo.slow')
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 1000, 'server responded in', ms, 'not in 1000ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.async('other requests with the query param use the query delay', function () {
  var start = new Date(),
      delay = 400;
  request(url + '?slow=' + delay)
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= delay && ms < delay + 200, 'server responded in', ms, 'not in ' +
          delay + ' to ' + (delay + 200) + 'ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.async('other requests without the query param are still fast', function () {
  var start = new Date();
  request(url)
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms < 150, 'server responded in', ms);
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});
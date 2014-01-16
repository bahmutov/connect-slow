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

gt.module('multiple connect-slow', {
  setupOnce: function () {
    var app = connect()
    .use(connect.logger('dev'))
    .use(slow({
      url: /\.slow$/i,
      delay: 500
    }))
    .use(slow({
      url: /\.very-slow$/i,
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
    gt.ok(ms >= 500 && ms < 600, 'server responded in', ms, 'not in 500ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.async('.very-slow requests are slow too', function () {
  var start = new Date();
  request(url + '/foo.very-slow')
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 500 && ms < 600, 'server responded in', ms, 'not in 500ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

gt.async('very requests are still fast', function () {
  var start = new Date();
  request(url + '/foo.html')
  .then(function (data) {
    gt.equal(data[0].statusCode, 200, 'code 200');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 0 && ms < 50, 'server responded in', ms);
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});
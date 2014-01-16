/*global gt:false*/
var slow = require('..');
gt.test('basic info', function () {
  gt.func(slow, 'connect-slow is a function');
});

var connect = require('connect');
var q = require('q');
var request = q.denodeify(require('request'));
var http = require('http');

var port = 3440;
var msg = 'hello world';

gt.module('without connect-slow tests', {
  setupOnce: function () {
    var app = connect()
    .use(connect.logger('dev'))
    .use(function sendMessage(req, res) {
      res.end(msg);
    });

    this.server = http.createServer(app).listen(port);
  },
  teardownOnce: function () {
    this.server.close();
    delete this.server;
  }
});

gt.async('simple test', function () {
  var start = new Date();
  request('http://localhost:' + port + '/test.js')
  .then(function (data) {
    // console.log(JSON.stringify(data, null, 2));
    gt.equal(data[0].statusCode, 200, 'code 200');
    gt.equal(data[1], msg, 'correct message');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms < 100, 'server responded in', ms, 'less than 100ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

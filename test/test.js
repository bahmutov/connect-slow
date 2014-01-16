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

gt.async('simple test', function () {
  var start = new Date();
  request(url)
  .then(function (data) {
    // console.log(JSON.stringify(data, null, 2));
    gt.equal(data[0].statusCode, 200, 'code 200');
    gt.equal(data[1], msg, 'correct message');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms >= 1000 && ms < 1100, 'server responded in', ms, 'not in 1000ms');
  })
  .fail(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});
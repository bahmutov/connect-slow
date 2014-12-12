/*global gt:false*/
var connect = require('connect');
var q = require('q');
var request = q.denodeify(require('request'));
var http = require('http');
var morgan = require('morgan');

var port = 3440;
var msg = 'hello world';
function sendMessage(req, res) {
  res.end(msg);
}

gt.module('without connect-slow tests', {
  setupOnce: function () {
    var app = connect()
    .use(morgan('dev'))
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
  request('http://localhost:' + port + '/test.js')
  .then(function (data) {
    // console.log(JSON.stringify(data, null, 2));
    gt.equal(data.statusCode, 200, 'code 200');
    gt.equal(data.body, msg, 'correct message');
    var end = new Date();
    var ms = end - start;
    gt.ok(ms < 100, 'server responded in', ms, 'less than 100ms');
  })
  .catch(function (err) {
    gt.ok(false, err);
  })
  .finally(function () {
    gt.start();
  });
});

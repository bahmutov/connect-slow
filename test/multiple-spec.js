'use strict'

var connect = require('connect');
var http = require('http');
var slow = require('..');
var morgan = require('morgan');
var got = require('got')
const la = require('lazy-ass')
const is = require('check-more-types')

var port = 3440;
var msg = 'hello world';
var url = 'http://localhost:' + port + '/something';

function sendMessage(req, res) {
  res.end(msg);
}

describe('multiple connect-slow', function () {
  before(function () {
    var app = connect()
    .use(morgan('dev'))
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
  })

  after(function () {
    this.server.close();
    delete this.server;
  })

  it('.slow requests are slow', function () {
    var start = new Date();
    return got(url + '/foo.slow')
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= 500, 'server responded in', ms, 'not in 500ms');
    })
  })

  it('.very-slow requests are slow too', function () {
    var start = new Date();
    return got(url + '/foo.very-slow')
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= 500, 'server responded in', ms, 'not in 500ms');
    })
  })

  it('very requests are still fast', function () {
    var start = new Date();
    return got(url + '/foo.html')
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= 0 && ms < 100, 'server responded in', ms);
    })
  })
})

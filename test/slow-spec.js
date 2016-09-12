'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const got = require('got')
var connect = require('connect');
var http = require('http');
var slow = require('..');
var morgan = require('morgan');

var port = 3440;
var msg = 'hello world';
var url = 'http://localhost:' + port + '/something';

function sendMessage(req, res) {
  res.end(msg);
}

describe('connect-slow default options tests', () => {
  before(function () {
    var app = connect()
    .use(morgan('dev'))
    .use(slow())
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  })

  after(function () {
    this.server.close();
    delete this.server;
  })

  it('slows everything down', function () {
    var start = new Date();
    return got(url)
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= 1000, 'server responded in', ms, 'not in 1000ms');
    })
  })
})

describe('connect-slow some resources', () => {
  before(function () {
    var app = connect()
    .use(morgan('dev'))
    .use(slow({
      url: /\.slow$/i,
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

  it('other requests are still fast', function () {
    var start = new Date();
    return got(url + '/foo.html')
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= 0 && ms < 150, 'server responded in', ms);
    })
  })
})

describe('connect-slow query parameter', () => {
  before(function () {
    var app = connect()
    .use(morgan('dev'))
    .use(slow({
      delay: 800,
      delayQueryParam: 'slow'
    }))
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  })
  after(function () {
    this.server.close();
    delete this.server;
  })

  it('slow down requests with the query param by the given delay', function () {
    var start = new Date(),
        delay = 400;
    return got(url + '?slow=' + delay)
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= delay && ms < delay + 200, 'server responded in', ms,
          'not in', delay, 'to', delay + 200, 'ms');
    })
  })

  it('other requests use default options', function () {
    var start = new Date();
    return got(url)
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= 800, 'server responded in', ms, 'not in 800ms');
    })
  })
})

describe('connect-slow query parameter and url regex', () => {
  before(function () {
    var app = connect()
    .use(morgan('dev'))
    .use(slow({
      url: /\.slow$/,
      delayQueryParam: 'slow'
    }))
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  })
  after(function () {
    this.server.close();
    delete this.server;
  })

  it('.slow requests with the query param use the query delay', function () {
    var start = new Date(),
        delay = 400;
    return got(url + '/foo.slow?slow=' + delay)
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= delay && ms < delay + 200, 'server responded in', ms, 'not in ' +
            delay + ' to ' + (delay + 200) + 'ms');
    })
  });

  it('.slow requests without the query param use the default delay', function () {
    var start = new Date();
    return got(url + '/foo.slow')
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= 1000, 'server responded in', ms, 'not in 1000ms');
    })
  });

  it('other requests with the query param use the query delay', function () {
    var start = new Date(),
        delay = 400;
    return got(url + '?slow=' + delay)
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms >= delay && ms < delay + 200, 'server responded in', ms, 'not in ' +
            delay + ' to ' + (delay + 200) + 'ms');
    })
  });

  it('other requests without the query param are still fast', function () {
    var start = new Date();
    return got(url)
    .then(function (data) {
      var end = new Date();
      var ms = end - start;
      la(ms < 150, 'server responded in', ms);
    })
  })
})

'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const got = require('got')
var connect = require('connect');
var http = require('http');
var morgan = require('morgan');

var port = 3440;
var msg = 'hello world';
function sendMessage(req, res) {
  res.end(msg);
}

describe('without connect-slow tests', () => {
  before(function () {
    var app = connect()
    .use(morgan('dev'))
    .use(sendMessage);
    this.server = http.createServer(app).listen(port);
  })
  after(function () {
    this.server.close();
    delete this.server;
  })

  it('simple test', function () {
    var start = new Date();
    return got('http://localhost:' + port + '/test.js')
    .then(function (data) {
      la(data.body === msg, 'correct message', data.body);
      var end = new Date();
      var ms = end - start;
      la(ms < 100, 'server responded in', ms, 'less than 100ms');
    })
  })
})

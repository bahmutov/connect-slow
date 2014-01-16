/*global gt:false*/
var slow = require('..');

gt.module('connect-slow basics');

gt.test('basic info', function () {
  gt.func(slow, 'connect-slow is a function');
});

gt.test('url should be a regexp', function () {
  gt.throws(function () {
    slow({
      url: '.html'
    });
  }, 'AssertionError');
});

gt.test('delay should be positive', function () {
  gt.throws(function () {
    slow({
      delay: -100
    });
  }, 'AssertionError');
});

gt.test('valid parameters', function () {
  var fn = slow({
    url: /\.jpg$/i,
    delay: 2000
  });
  gt.arity(fn, 3, 'middleware expects 3 arguments');
});
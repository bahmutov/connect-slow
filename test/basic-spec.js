const slow = require('..');
const la = require('lazy-ass')
const is = require('check-more-types')

describe('connect-slow basics', () => {

  it('basic info', function () {
    la(is.fn(slow), 'connect-slow is a function');
  });

  it('url should be a regexp', function () {
    is.raises(function () {
      slow({
        url: '.html'
      });
    });
  });

  it('delay should be positive', function () {
    is.raises(function () {
      slow({
        delay: -100
      });
    });
  });

  it('valid parameters', function () {
    var fn = slow({
      url: /\.jpg$/i,
      delay: 2000
    });
    la(fn.length === 3, 'middleware expects 3 arguments');
  })
})

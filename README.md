# connect-slow v0.0.0

> Middleware to delay answering requests based on request url, useful to diagnose website behavior based on load delays

[![NPM][connect-slow-icon] ][connect-slow-url]

[![Build status][connect-slow-ci-image] ][connect-slow-ci-url]
[![semantic-release][semantic-image] ][semantic-url]

[connect-slow-icon]: https://nodei.co/npm/connect-slow.png?downloads=true
[connect-slow-url]: https://npmjs.org/package/connect-slow
[connect-slow-ci-image]: https://travis-ci.org/bahmutov/connect-slow.png?branch=master
[connect-slow-ci-url]: https://travis-ci.org/bahmutov/connect-slow



```js
var connect = require('connect');
var http = require('http');
var slow = require('connect-slow');
var app = connect()
    .use(connect.logger('dev'))
    .use(slow({
        url: /\.jpg$/i,
        delay: 2000
    }))
    .use(connect.static('public'));
http.createServer(app).listen(4000);
$ curl http://localhost:4000/index.html  // 1 ms
$ curl http://localhost:4000/foto.jpg    // 2001 ms
```

Works with [Connect](http://www.senchalabs.org/connect/),
[Express](http://expressjs.com/), [turtle-run](https://github.com/bahmutov/turtle-run). 
If you use [Koa](http://koajs.com/) see [koa-slow](https://github.com/bahmutov/koa-slow).



## Why?

Controlled server-side delays allow to debug and polish
website behavior, see
[Give browser a chance](http://bahmutov.calepin.co/give-browser-a-chance.html)

install:

```
npm install connect-slow --save
```

slow down every requst by 1 second (default delay value)

```js
var slow = require('connect-slow');
var app = connect()
    .use(slow())
    ...
```
slow down JPEG images by 500ms,
let everything else be served as quick as possible

```js
var slow = require('connect-slow');
var app = connect()
    .use(slow({
        url: /\.[jpg|jpeg]$/i,
        delay: 500
    }))
    ...
```

slow down JPEG images by 1000ms, slow down JavaScript files by 100ms

```js
var slow = require('connect-slow');
var app = connect()
    .use(slow({
        url: /\.[jpg|jpeg]$/i,
        delay: 1000
    }))
    .use(slow({
        url: /\.js$/i,
        delay: 100
    }))
    ...
```

You can see console log of delayed urls by passing option `debug`

```js
slow({
    url: /\.[jpg|jpeg]$/i,
    delay: 1000,
    debug: true
})
```

#### Related projects

* [connect-pause](https://github.com/flesler/connect-pause) - extremely simple
delay
* [koa-slow](https://github.com/bahmutov/koa-slow) - same funtionality as
connect-slow for [Koa](http://koajs.com/) server



### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/connect-slow/issues) on Github



## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.




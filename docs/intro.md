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
[Express](http://expressjs.com/) but not [Koa](http://koajs.com/) yet.
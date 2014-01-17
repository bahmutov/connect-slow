install:

```
npm install {%= name %} --save
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

### Related projects

* [connect-pause](https://github.com/flesler/connect-pause) - extremely simple
delay
* [koa-slow](https://github.com/bahmutov/koa-slow) - same funtionality as
{%= name %} for [Koa](http://koajs.com/) server
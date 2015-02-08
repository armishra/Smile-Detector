#sink_q.js
###Intro
This library is used for queuing async functions and flushing the queue when an on ready function is called. For example, if you need to run configuration code before a function can be called, its best to wrap the functions that need configuration in a call to queue.push and call queue.ready when the 'ready' event is emitted. This way, the configuration code will run first and the queue will be flushed automatically when 'ready' fires.

Use this library if you need to run multiple async commands in series and want to store the async calls until after configration code has executed. The queue works by calling each asynchronous after the previous asynchronous function's callback is called.

###How to Use
Require the sink_q library

```js
var Queue = require(sink_q);
```

Call lé constructor

```js
var myQueue = new Queue();
```


The two public methods are "push" and "ready". Push will push events onto the queue and will fire them as soon as 
the queue is ready.
```js
myQueue.ready(); // Call this when you're ready to rock
```

There are two ways to call push. If you dont need to execute a callback, simply do
```js
myQueue.push(function () {
  async stuff sans callback
});
```

If the function has a callback instead run 
```js
myQueue.push(function (callback) {
  async stuff with callback
}, callback)
```

If you push a function onto the queue whose callback pushes a function onto the queue you'll run into a deadlock. This happens because the outer function's callback won't be called until the queue unlocks and the queue remains locked until the inner function (AKA the outer function's callback) is called. This is confusing so hopefully an example will explain it.
```js
myQueue.push(function (callback) {
  myQueue.push(function () {
    async stuff
  })
}, callback)

```

The solution to the deadlock is setting the setImmeadiate flag to true when you push a function which pushes a function onto the queue.
```js
myQueue.push(function (callback) {
  myQueue.push(function () {
    async stuff
    callback();
  })
}, callback, true)
```

Notice that to resolve the deadlock we use
```js
myQueue.push(function (callback) {}, callback, true)
```

instead of 

```js
myQueue.push(function (callback) {}, callback)
```
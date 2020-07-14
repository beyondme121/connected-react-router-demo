function EventEmitter() {
  this._events = {}
}

// 原型上的方法 on emit
EventEmitter.prototype.on = function (eventName, callback) {
  // console.log("this", this)   // this是继承的类 如 Girl,但Girl上没有_events
  if (!this._events) {
    this._events = {}
  }
  // events模块内部有newListener的监听
  if (eventName !== 'newListener') {
    // 如果绑定的不是newListener方法,比如绑定play,那就要执行newListener的方法
    this.emit('newListener', eventName)
  }
  // 如果之前有订阅,就取出来所有的callbacks,并追加, 没有就创建新的数组
  let callbacks = this._events[eventName] || []
  // this._events[eventName] = callbacks.push(callback)  
  // push的返回结果是数组的最新的长度...
  callbacks.push(callback)
  this._events[eventName] = callbacks
}

EventEmitter.prototype.emit = function (eventName, ...args) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      // fn(...args)
      Reflect.apply(fn, this, args)
      // fn.call(this, ...args)
    })
  }
}

EventEmitter.prototype.off = function (eventName, callback) {
  if (this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(item => {
      // (item !== callback) 判断解绑的函数名与存储的不一致就保留下来,一致就抛弃,就实现了off
      // (item.listener !== callback): once之后马上就off
      return (item !== callback) && (item.listener !== callback)
    })
  }
}

// once的特点, 绑定一次, emit多次也只触发一次, 触发完把callback从events列表中移除
EventEmitter.prototype.once = function (eventName, callback) {
  // 如下写法错误的, 刚绑定就解除绑定
  // this.on(eventName, callback)
  // this.off(eventName, callback)

  // 思路: 先绑定一个函数,函数内部执行callback, 然后在函数内部解绑 ==> 加一层
  // this.on(eventName, () => {
  //   callback()
  //   this.off(eventName, 函数名??)     // 此处的函数名就是this.on监听的函数名
  // })
  let one = () => {
    callback()
    this.off(eventName, one)
  }
  // 存储真实的绑定函数
  one.listener = callback
  // 订阅one函数,emit触发执行之后,执行one函数回调, 就执行了真实的callback函数
  // 在one内部解绑 one函数
  this.on(eventName, one)
}


module.exports = EventEmitter



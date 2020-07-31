function EventEmitter() {
  this._events = {}
}

// 订阅
EventEmitter.prototype.on = function (eventName, fn) {
  // 订阅中的this就是Girl实例,Girl实例上没有,所以必须创建一个给自定义的类
  if (!this._events) {
    this._events = {}
  }
  let callbacks = this._events[eventName] || []
  callbacks.push(fn)
  this._events[eventName] = callbacks
}

EventEmitter.prototype.emit = function (eventName, ...args) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      fn(...args)
    })
  }
}

EventEmitter.prototype.off = function (eventName, fn) {
  if (this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(event => {
      return (event !== fn) && (event.listener !== fn)
    })
  }
}
// 绑定,触发多次只执行一次, 即
EventEmitter.prototype.once = function (eventName, fn) {
  const one = () => {
    fn()
    this.off(eventName, one)    // 解绑的是one函数, 实际中, 解绑的是某个自定义的函数名
  }
  one.listener = fn
  this.on(eventName, one)

  // 如下是错误的, 必须要执行一次
  // this.on(eventName, fn)
  // this.off(eventName, fn)
}

module.exports = EventEmitter
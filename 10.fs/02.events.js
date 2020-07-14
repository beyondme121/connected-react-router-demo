// const EventEmitter = require('events')

// // 看一下类的原型上的方法有哪些
// // console.log(EventEmitter.prototype)   // on, once, off, emit
// // console.log(EventEmitter)
// let events = new EventEmitter()

// // 订阅我饿了,做什么
// events.on('我饿了', () => {
//   console.log('做饭')
// })

// events.on('我饿了', () => {
//   console.log('吃饭')
// })

// // 发布
// events.emit('我饿了')



// // -------------------- 通常自己写的类, 可以继承EventEmitter原型上的方法, 就可以进行发布订阅了 --------------------

// class Girl { }

// // 类继承: 原型继承
// Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)

// // 此时Girl类的实例就有了on emit等发布订阅的方法

// let girl = new Girl
// console.log(girl)

// const pingpang = () => console.log('pingpang')
// const basket = () => console.log('basket')
// girl.on('出去玩', pingpang)
// girl.once('出去玩', basket)
// girl.once('出去玩', basket)
// girl.once('出去玩', basket)

// girl.off('出去玩', pingpang)

// girl.emit('出去玩')


// ------------------------
const EventEmitter = require('events')
const util = require('util')

class Girl { }
util.inherits(Girl, EventEmitter)

let girl = new Girl
const eat = () => console.log('吃')
const cry = () => console.log('哭')

// 需求: 订阅后自动触发订阅
girl.once('newListener', type => {
  // type就是绑定的监听名称, play
  console.log("type:", type)
  // 直接执行此时事件数组中,
  // girl.emit(type)
  process.nextTick(() => {
    girl.emit(type)
  })
})
// girl.on('play', eat)
// girl.on('play', eat)
girl.once('play', cry)
girl.once('play', cry)
girl.once('play', cry)
girl.once('play', eat)



// girl.off('play', cry)
// girl.off('play', eat)

// girl.off('play', cry)

// girl.emit('play')
// girl.emit('play')

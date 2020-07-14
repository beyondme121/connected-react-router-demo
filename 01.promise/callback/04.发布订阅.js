// 发布订阅模式: 发布和订阅没有任何关联, 可以只订阅不发布, 或者只发布不订阅

// 等我有钱了, 我要买房买车.  => 买房买车就是计划,就是订阅on; 等我有钱了, 有钱了就是发布emit

// 订阅的时候.on,就是收集所有的要做的事情, 当发布emit的时候, 把收集好的订阅(数组), 依次执行
const fs = require('fs')

let event = {
  arr: [],
  // 订阅
  on(callback) {
    this.arr.push(callback)
  },
  // 发布
  emit() {
    this.arr.forEach(fn => fn())
  }
}

let obj = {}
// 实际订阅了具体做什么事情
event.on(() => {
  console.log('订阅了数据, current obj:', obj)
})

event.on(() => {
  console.log('多次订阅,执行不同的事情', obj)
})



fs.readFile('./01.highOrder.js', (err, data) => {
  obj.name = 'sanfeng'
  event.emit()
})

fs.readFile('./02.currying.js', (err, data) => {
  obj.age = 11
  event.emit()
})



























// let event = {
//   _arr: [],
//   // 订阅: 收集所有的订阅函数,放到数组中
//   on(callback) {
//     console.log("this", this)
//     this._arr.push(callback)
//   },
//   // 发布: 触发执行
//   emit() {
//     this._arr.forEach(_ => _())
//   }
// }
// let obj = {}

// // -------------- 实际订阅了两个具体的执行函数
// // 订阅
// event.on(() => {
//   console.log('数据获取到了')
// })

// event.on(() => {
//   if (Object.keys(obj).length === 2) {
//     console.log('完成了, ', obj)
//   }
// })


// fs.readFile('./01.highOrder.js', (err, data) => {
//   obj.name = 'sanfeng'
//   event.emit()
// })

// fs.readFile('./02.currying.js', (err, data) => {
//   obj.age = 11
//   event.emit()
// })

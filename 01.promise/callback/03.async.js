// 多个异步函数调用, 所有的函数都调用完成后, 做点什么事情
// 可以解决异步并发, 获取到所有异步调用执行完成后的结果, 即 全部完成之后做点有趣的事情

// 思路: 每次异步执行完成后, 计数器加1, 当计数器等于 异步调用的函数个数

const fs = require('fs')

const after = (time, callback) => () => {
  --time == 0 && callback()
}

// 执行几次之后, 做什么
const doThing = after(2, () => {
  console.log('hello')
})


fs.readFile('./01.highOrder.js', (err, data) => {
  console.log(data)
  doThing()
  out2()
})

fs.readFile('./02.currying.js', (err, data) => {
  console.log(data)
  doThing()
  out2()
})


// 1. 两次异步调用, 每次调用我都调用一个函数, 用于记录执行次数, 如果到了指定的要求(执行次数 === 预先预定好的个数), 就执行

function afterThen(time, callback) {
  return () => {
    --time === 0 && callback()
  }
}

const out2 = afterThen(2, () => {
  console.log('2222')
})


// 场景(强要求): 只能解决当所有都执行完成之后, 才执行回调函数

// 需求更新: 只要异步函数执行完成之后, 就做点什么事情
// ==> 发布订阅






























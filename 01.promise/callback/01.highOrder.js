// 高阶函数
// 1. 接收函数或者返回函数


function say(x, y, z) {
  console.log(x, y, z)
}

// 希望在执行say之前,做点什么, 所有函数在执行前都做点什么
Function.prototype.before = function (callback) {
  return (...args) => {
    // 执行用户自定义的函数, ==> 先做点什么
    callback()
    // 再执行原函数(调用函数)
    this(...args)
  }
}

// 函数say执行前做的事情
const newSay = say.before(() => {
  console.log('function init...')
})

newSay(1, 2, 3)



Function.prototype.after = function (callback) {
  let that = this
  return function inner() {
    // console.log("arguments", arguments)     // 非箭头函数,arguments 类数组 arguments [Arguments] { '0': 4, '1': 5, '2': 6 }
    // 用户自定义函数
    callback()
    // 原始函数
    that(arguments)
  }
}

const afterSay = say.after(() => {
  console.log("destroy function...")
})

afterSay(4, 5, 6)



Function.prototype.print = function (cb) {
  return (...args) => {
    // 自定义逻辑
    cb()
    this(...args)      // 调用print函数的函数对象, 如果有参数
  }
}

const fn = () => { }
fn.print(() => {
  console.log('print...')
})

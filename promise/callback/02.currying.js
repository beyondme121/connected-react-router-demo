// 函数柯里化
// 1. 细化函数功能, 让函数更具体(柯里化的作用)
// 比如判断变量的类型, isType('hello', 'String'), isType(123, 'Number')
// 让用户传递数据类型String, Number,...

// 我们希望, 细化函数, 不是isType了

// 柯里化与偏函数的区别
/**
 * 柯里化: 参数一个个的传递
 * 偏函数: 参数的传递不确定
 */

function checkType(type) {
  return value => {
    return Object.prototype.toString.call(value) === `[object ${type}]`
  }
}

const checkString = checkType('String')
console.log(checkString(123))

let typeArr = ['String', 'Number', 'Undefined', 'Null']
// 构造一个对象, util, util.checkString(value)  => true, false

let util = {}

typeArr.forEach(type => {
  util[`check${type}`] = checkType(type)
})
console.log("柯里化")
console.log(util.checkNumber(123))
console.log(util.checkUndefined(undefined))



// 多层柯里化
const curryFn = type => {
  return flag => {
    return value => {
      console.log("flag", flag)
      return Object.prototype.toString.call(value) === `[object ${type}]`
    }
  }
}

let arr = []
let obj = {}
typeArr.forEach(type => {
  let _fn = curryFn(type)('flag')
  obj['is' + type] = value => {
    return _fn(value)
  }
})

console.log(obj.isString(123))



function sum(a, b, c, d) {
  console.log(a, b, c, d)
}


// 通用函数的柯里化, 对某个函数进行柯里化, wrapper包装后的函数, 可以传递不定个数的参数,多次调用, 高阶函数

// 错误原因分析: 根本就没理解 二货

/* function curry(fn, arr = []) {
  let len = fn.length // 记录原始函数的参数个数
  return function _fn(...args) {
    let concatArr = [...arr]
    if (concatArr.length < len) {
      concatArr = [...concatArr, ...args]
      return curry(_fn, concatArr)
    } else {
      return fn(...concatArr)
    }
  }
} */



// const newSum = curry(sum)
// newSum(1, 2)(3)(4)
// 如上调用方式说明, newSum是个函数, curry函数是高阶函数 => 返回一个函数,这个函数可以多次调用, 多次



function currying(fn, arr = []) {
  // 记录原始函数参数个数
  let len = fn.length
  return (...args) => {
    let concatArr = [...arr, ...args]   // 把初始的参数列表和调用一次柯里化函数的参数列表合并
    // 判断 记录参数个数的数组的长度是否小于原始函数的个数, 小于说明还需要传递参数, 继续返回柯里化函数, 继续包装原函数
    if (concatArr.length < len) {
      return currying(fn, concatArr)
    } else {
      // 当个数相等了, 就执行原函数, 参数就是累加后的数组
      return fn(...concatArr)
    }
  }
}


const newFn = currying(sum)
newFn(1)(2, 3)(4)


// 通用柯里化函数的应用
// 把判断变量类型的函数通过柯里化的方式进行处理

function isType(type, content) {
  return Object.prototype.toString.call(content) === `[object ${type}]`
}

console.log(isType('String', 'hello'))

let utils = {}
typeArr.forEach(type => {
  // currying(isType)(type)的执行结果还是柯里化函数, 需要再次传递一个参数 content, 才能够执行
  utils['is' + type] = currying(isType)(type)
})

console.log(utils.isString('hello'))
console.log(utils.isNumber('dd'))

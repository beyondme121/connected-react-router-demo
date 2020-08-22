// 数组的原型对象
let oldArrayProtoMethods = Array.prototype

// 根据原型对象创建对象, 继承的数组的原型上的方法, 都挂载到新对象arrayMethod的原型链上__proto__, 可以通过arrayMethods.push, 直接方法, 原型链查找
let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
  'push',
]

methods.forEach(method => {
  arrayMethods[method] = function () {
    console.log('数组操作执行了')
    let r = oldArrayProtoMethods[method].apply(this, arguments)
    return r
  }
})

console.log(arrayMethods)

let arr = [1, 2]
// arr.__proto__ = arrayMethods
Object.setPrototypeOf(arr, arrayMethods)

arr.push(3, 4, 5)
console.log(arr)

arr.pop()
console.log(arr)
// Vue2.x 数据的双向绑定原理 Object.defineProperty()

// let obj = {}
// let other = null
// // 设置obj对象的name属性, 是否可配置,可枚举, get, set
// // 默认情况下, 可配置,可枚举, 可写都是false
// Object.defineProperty(obj, 'name', {
//   enumerable: true,
//   configurable: true,
//   writable: false,
//   get() {
//     return other
//   },
//   set(val) {
//     other = val
//   }
// })

// obj.name = "hello"
// console.log(obj.name)


// let obj = {}
// let other = ''        // 通过中间变量实现变量的get set, 实现修改对象的属性值, 可以立刻获取到最新的属性值

// Object.defineProperty(obj, 'name', {
//   // value: '123'
//   enumerable: true,     // 对象属性是否可枚举 for...in是否可以拿到key
//   configurable: true,   // 对象的属性是否可删除
//   get() {
//     return other
//   },
//   set(val) {
//     other = val
//   }
// })
// obj.name = 'hello'
// console.log(obj.name)

// for (let key in obj) {
//   console.log(key)
// }

// delete obj.name
// console.log(obj.name)


let obj = {
  other: 'init',
  get name() {
    return this.other
  },
  set name(val) {
    this.other = val
  }
}

console.log(obj.name)
obj.name = 'hello'
console.log(obj.name)
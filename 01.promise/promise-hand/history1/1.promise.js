// promise特点
// 1. 类 class
// 2. 参数是excutor 执行器
// 3. 实例化promise对象,立即执行excutor函数 
// 4. excutor函数接受两个参数(内部参数) resolve, reject，这两个参数也是函数 成功是调用resolve, 失败=> reject promise实例无法访问resolve,reject方法, 不是实例方法
// 5. promise对象有三种状态 pending, fulfill, reject, pending=> fulfill, pending => reject

// let promise = new Promise((resolve, reject) => {
//   console.log('hello')
//   resolve(100)
//   reject(999)
// })

// console.log('world')
// console.log(promise)


const Promise = require('./promise')

// const promise = new Promise((resolve, reject) => {
//   // reject(300)
//   resolve(100)
// })
// console.log('promise: ', promise)

// const p1 = new Promise((resolve, reject) => {
//   console.log("123")
//   setTimeout(() => {
//     resolve(250)
//   }, 1000)
// })

// p1.then(val => {
//   console.log("val:", val)
// }, err => {
//   console.log("err", err)
// })


let promise = new Promise((resolve, reject) => { // resolve 代表的是成功的回调  reject 表示的是失败的回调
  console.log('123')
  // setTimeout(() => {
  //   resolve('ok')
  // }, 1000);
  // resolve('OK')
  // reject('not ok')
  throw new Error('出错了')
});
promise.then((val) => {
  console.log('success', val)
}, (reason) => {
  console.log('fail', reason)
})


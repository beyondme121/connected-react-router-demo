const fs = require('fs')
// 把一个异步的回调 转化为promisify

const readFile = promisify(fs.readFile)

readFile('./name.txt', 'utf8').then(res => {
  console.log(res)
}, err => {
  console.log(err)
})


function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }
}


// function promisify(fn) {
//   return (...args) => {
//     return new Promise((resolve, reject) => {
//       fn(...args, (err, data) => {
//         if (err) reject(err)
//         resolve(data)
//       })
//     })
//   }
// }


// 给所有的node模块的异步回调方法 增加promisify方法

const promisifyAll = target => {

}
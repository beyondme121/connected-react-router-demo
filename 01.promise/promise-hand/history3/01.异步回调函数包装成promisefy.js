const fs = require('fs')

// fs.readFile('./name.txt', 'utf8', (err, data) => {
//   if (err) throw err
//   console.log(data)
// })

// 函数的调用返回一个promise对象, 根据内部执行状态的结果, 触发执行then中的两个函数
const read = (url) => {
  return new Promise((resolve, reject) => {
    fs.readFile(url, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

// 第一个then中返回的是普通值, 就不是promise
read('./name.txt').then(data => {
  return 'hello'
}, err => {
  return 'world'      // 失败的回调如果返回了普通值, 也会走下一个then函数的成功回调
}).then(data => {
  console.log(data)
}, err => {
  console.log(err)
})


function readPromisify(url) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const p1 = readPromisify('./name.txt').then(data => {
  console.log(data)
})


const p2 = new Promise((resolve, reject) => { })
console.log('p2', p2)
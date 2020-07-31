// 重新review代码

let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('ok')
    } else {
      reject('not ok')
    }
  }, 1000);
})

let promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('ok')
    } else {
      reject('not ok')
    }
  }, 1000);
})

// promise.then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)
// })

// promise数组,返回值也是promise
// Promise.all([promise1, promise2]).then(function (result) {
//   console.log('chenggong')
// })

Promise.resolve({ name: 'dd' }).then(res => console.log(res))
console.log(Promise.resolve({ name: 'dd' }))
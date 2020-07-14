const Promise = require('./promise')

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
  }, 1000);
})


promise.then((val) => {
  console.log(val)
}, (err) => {
  console.log(err)
})

promise.then((val) => {
  console.log(val + 100)
}, (err) => {
  console.log(err)
})

promise.then((val) => {
  console.log(val + 300)
}, (err) => {
  console.log(err)
})
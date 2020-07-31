const express = require('./express')
const app = express()

app.get('/', (req, res, next) => {
  console.log(1)
  next()
  console.log(2)
})
app.get('/', async (req, res, next) => {
  // await new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('ok')
  //   }, 1000);
  // })
  console.log(3)
  next()
  console.log(4)
  // res.end('ok')
})
app.get('/', (req, res, next) => {
  console.log(5)
  next()
  console.log(6)
})

app.get('/', (req, res, next) => {
  res.end('ok!!!')
})

// app.get('/', async function (req, res, next) {
//   console.log(1)
//   await next()
//   console.log(2)
// })

// app.get('/', async function (req, res, next) {
//   console.log(3)
//   await new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('timeout')
//       resolve('ok')
//     }, 2000);
//   })
//   next()
//   console.log(4)
// })


app.listen(3000)
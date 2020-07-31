const express = require('./express')
const app = express()

app.get('/',
  function (req, res, next) {
    console.log(1)
    setTimeout(() => {
      next() // 3s之后执行下一个路由的handler
    }, 3000)
  },
  function (req, res, next) {
    console.log('setTimeout')
    next()
  })

app.get('/', function (req, res, next) {
  console.log(2)
  next()
})
app.get('/', function (req, res, next) {
  console.log(3)
  // next()
  res.end('end')
})

// app.route('/home')
//   .get(function (req, res) {
//     res.end('查询')
//   })
//   .post(function (req, res) {
//     res.end('增加')
//   })

app.listen(3000, () => {
  console.log(`server start at 3000`)
})
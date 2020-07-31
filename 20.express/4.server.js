// 中间件
const express = require('./express')
const app = express()

// app.use(function (req, res, next) {
//   console.log('first')
//   next()
// })

// app.use('/', function (req, res, next) {
//   console.log(1)
//   next()
// }, function (req, res, next) {
//   console.log(2)
//   next()
// })

// app.use('/user', function (req, res, next) {
//   console.log('/user')
//   next()
// })

// app.use('/user/', function (req, res, next) {
//   console.log('/user/')
//   next()
// })

// // 请求也会命中 /user 和 /user/ 这两个路径
// app.use('/user/add', function (req, res, next) {
//   console.log('/user/add')
//   next()
// })

// app.use('/useradd', function (req, res, next) {
//   console.log('/useradd')
//   next()
// })

// app.get('/', function (req, res, next) {
//   console.log("router get")
// })

// app.listen(3000, () => {
//   console.log(`server start 3000`)
// })


app.use('/', function (req, res, next) {
  console.log(1);
  next();
}, function (req, res, next) {
  console.log(2);
  next();
}, function (req, res, next) {
  console.log(3);
  next();
})
app.use(function (req, res, next) {
  console.log(4);
  next();
})
app.use('/user', function (req, res, next) {
  console.log('/user');
  next();
})
app.get('/user/add', function (req, res) {
  console.log('user add');
})
app.get('/useradd', function (req, res) {
  console.log('useradd');
})
app.listen(3000);
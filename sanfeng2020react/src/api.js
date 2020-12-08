// let express = require('express')
// let cors = require('cors')
// let app = express()
// app.use(cors())

// app.get('/api/users', (req, res, next) => {
//   let start = parseInt(req.query.start)
//   let pageSize = parseInt(req.query.pageSize)
//   let users = []
//   for (let i = start; i < start + pageSize; i++) {
//     users.push({ id: `${i + 1}`, name: `name_${i + 1}` })
//   }
//   setTimeout(() => {
//     res.json(users)
//   }, 2000)
// })

// app.listen(8080)

let express = require('express')
let cors = require('cors')
let app = express()
app.use(cors())
app.get('/api/users', (req, res, next) => {
  let start = parseInt(req.query.start)
  let pageSize = parseInt(req.query.pageSize)
  let users = []
  for (let i = start; i < start + pageSize; i++) {
    users.push({ id: `${i + 1}`, name: `name_${i + 1}` })
  }
  setTimeout(() => {
    res.json(users) //json数组
  }, 3000)
})
app.listen(8080)

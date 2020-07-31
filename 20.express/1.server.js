const express = require('./express')
const app = express()

app.get('/', function (req, res) {
  res.end('ok')
})

app.get('/home', function (req, res) {
  res.end('home')
})

app.get('/about', function (req, res) {
  res.end('about')
})


app.listen(3000, () => {
  console.log(`server start at 3000`)
})
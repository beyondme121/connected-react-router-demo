const fs = require('fs')
const path = require('path')

let filePath = path.resolve(__dirname, 'copy.txt')
// 1. 创建可写流
let ws = fs.createWriteStream(filePath, {
  flags: 'w',
  encoding: 'utf8',
  mode: 0o666,
  start: 0,
  highWaterMark: 1
})

// ws.write('hello顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶', function () {
//   console.log('hello ok')
// })
// ws.write('a', function () {
//   console.log('ok')
// })
// ws.write('b', function () {
//   console.log('ok')
// })
// ws.write('c', function () {
//   console.log('ok')
// })

fs.writeFile(path.join(__dirname, 'wf.txt'), 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', function () { })
fs.writeFile(path.join(__dirname, 'wf.txt'), 'b', function () { })


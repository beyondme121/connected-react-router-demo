// const fs = require('fs')

// const rs = fs.createReadStream('./events.js', {
//   flags: 'r',
//   mode: 0o666,
//   autoClose: true,
//   encoding: null,
//   start: 0,   // 从文件的哪个位置开始读取
//   end: 200, // 读取到文件的哪个位置
//   highWaterMark: 20     // 每次读取的字节数
// })

// let res = []

// rs.on('data', (data) => {
//   console.log('data', data)
//   res.push(data)
// })

// rs.on('end', () => {
//   // console.log(Buffer.concat(res).toString())
// })

// rs.on('open', () => {
//   console.log('文件打开')
// })

// rs.on('close', () => {
//   console.log('文件关闭')
// })

// rs.on('error', err => {
//   console.log("err: ", err)
// })

// setTimeout(() => {
//   console.log('pause')
//   rs.pause()
// }, 500);
// setTimeout(() => {
//   rs.resume()
// }, 1000)


// const rs1 = fs.createReadStream('./01.read.js', { flags: 'r', mode: 0o666, })

// let arr = []
// rs1.on('data', data => {
//   arr.push(data)
// })

// rs1.on('end', () => {
//   console.log(Buffer.concat(arr))
// })




const fs = require('fs')
const ReadStream = require('./readStream')
const rs = new ReadStream('./01.read.js', {
  flags: 'r',
  mode: 0o666,
  encoding: null,
  start: 0,
  end: 30,
  autoClose: true,
  highWaterMark: 5
})

rs.on('error', err => {
  console.log("err----->", err)
})

rs.on('open', fd => {
  console.log("fd: ", fd)
})

rs.on('data', data => {
  console.log("data: ", data)
})


// rs.on('open', () => {
//   console.log('文件打开')
// })

// rs.on('data', data => {
//   console.log("data", data)
// })

// rs.on('error', err => {
//   console.log("err: ", err)
// })
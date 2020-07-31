// while 同步调用write
// 可写流的drain方法

const fs = require('fs')

let ws = fs.createWriteStream('./copy.txt', {
  flags: 'w',
  mode: 0o666,
  encoding: 'utf8',
  start: 0,
  highWaterMark: 3
})

// ws.write有返回值
// let flag = ws.write('h')
// console.log(flag)
// flag = ws.write('e')
// console.log(flag)
// flag = ws.write('l')
// console.log(flag)
// flag = ws.write('l')
// console.log(flag)
// flag = ws.write('o')
// console.log(flag)
// ws.end('100')   // => write / close

// ws.on('close', () => {
//   console.log('close')
// })
// ws.on('open', () => {
//   console.log('open')
// })

// true
// true
// false
// false
// false
// close


// 写一个方法, 方便多次调用
// function write () {
//   let i = 0;
//   while (i < 10) {

//   }
// }

let i = 0
function write() {
  let flag = true
  // 如果小于10 并且 写入文件的字节数 大于或等于了highWaterMark了, write返回值就会是false
  while (i < 10 && flag) {
    flag = ws.write(i++ + '')   // 不能是数值
    console.log("write flag: ", flag)
  }
}
write()

ws.on('drain', () => {
  console.log('drain')
  write()
})
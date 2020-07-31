const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
let content = fs.readFileSync(path.join(__dirname, 'gbk.txt'))
console.log(content.toString()) // 乱码, node不支持gbk格式, 需要转换
console.log(iconv.decode(content, 'gbk'))


// let buf = Buffer.alloc(3)
let buf2 = Buffer.from('中国')
console.log(buf2)   // utf8编码，一个中文3字节

// 常用方法
console.log(buf2.toString())

let arr = [[1, 2, 3]]
let newArr = arr.slice()
newArr[0][1] = 100
console.log(newArr)
console.log(arr)

// buffer转换成base64
console.log(Buffer.from("三疯").toString("base64"))  // 5LiJ55av

// base64转换成字符串
console.log(Buffer.from("5LiJ55av", "base64").toString())

// 截取buffer
console.log(Buffer.from("三疯").slice(0, 3))
console.log(Buffer.from("三疯").slice(0, 3).toString("base64"))


buf = Buffer.from("中国人")
let bufstr = Buffer.alloc(9)
buf.copy(bufstr, 0, 0, 9)
console.log(bufstr.toString())

Buffer.prototype.copy = function (targetBuffer, targetStart, sourceStart = 0, sourceEnd = this.length) {
  for (let i = sourceStart; i < sourceEnd; i++) {
    targetBuffer[targetStart++] = this[i]
  }
}

let container = Buffer.alloc(100)
let bb = Buffer.from("美丽的aaa")
// bb.copy(container, 0, 0, 20)
// console.log(container.toString())

bb.copy(container, 0)
console.log(" --> ", container.toString())


// Buffer.concat

let b1 = Buffer.from('sanfeng')
let b2 = Buffer.from('架构')
let newB = Buffer.concat([b1, b2])
console.log(Buffer.concat([b1, b2]))


Buffer.concat = function (bufferList, len = bufferList.reduce((a, b) => a + b.length, 0)) {
  // 内部分配空间
  let buffer = Buffer.alloc(len)
  let offset = 0
  bufferList.forEach(buf => {
    buf.copy(buffer, offset)
    offset += buf.length
  })
  return buffer
}

console.log(Buffer.concat([b1, b2, Buffer.from('三疯')]).toString())
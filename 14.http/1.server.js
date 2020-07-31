const http = require('http')
const url = require('url')

let server = http.createServer((req, res) => {
  // 1. url解析(请求头, 请求路径, 参数, query参数)
  let reqURL = req.url
  let method = req.method
  let headers = req.headers
  console.log("headers,", headers)
  // 2. 请求体
  let urlObj = url.parse(reqURL, true)      // true: 将query参数解析成对象形式,
  let { pathname, query } = urlObj
  console.log(pathname, query)
  // 3. 流 发送请求体进行测试
  // 请求是可读流 on('data'), on('end'); 可写流 write(), end()
  // let arr = []
  // let buf = ''
  // req.on('data', chunk => {
  //   console.log(chunk)
  //   arr.push(chunk)
  // })
  // req.on('end', () => {
  //   buf = Buffer.concat(arr)
  //   console.log('buf: ', buf)
  // })
  // 4. CPU密集型会阻塞线程
  let sum = 0
  if (req.url === '/sum') {
    for (let i = 1; i < 50000; i++) {
      sum += i
    }
    console.log("sum: ", sum)
    res.end("sum: ", sum)
  }

  // res.statusCode = 200
  // res.setHeader('username', 'sanfeng')
  // res.end('ok')

}).listen(3000, () => {
  console.log(`server start at port 3000`)
})

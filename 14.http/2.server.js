const http = require('http')
const url = require('url')

http.createServer((req, res) => {
  let sum = 0; // 工程化 *   前后端分离  基于react vue的ssr
  if (req.url === '/sum') { // 主要靠的是切换快
    setTimeout(() => {
      console.log('timeout')
      for (let i = 0; i < 10000000; i++) {
        sum += i;
      }
      res.end(sum + '')
    }, 5000);

  } else {
    res.end('ok');
  }
}).listen(3000, () => {
  console.log(`server start at port 3000`)
})

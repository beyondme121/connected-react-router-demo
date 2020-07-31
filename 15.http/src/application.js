const fs = require('fs').promises   // 将fs的函数变成promise化
const http = require('http')
const path = require('path')
const url = require('url')
const chalk = require('chalk')

class Server {
  constructor({ port, address, directory }) {
    this.port = port
    this.address = address
    this.directory = directory
  }
  // 处理请求函数, 静态资源管理 根据路径返回内容或目录列表
  async handleRequest(req, res) {
    let { pathname } = url.parse(req.url)   // 只考虑路径, 不考虑查询query
    // 访问的是localhost:3000/bin/www.js  => 实际访问物理路径绝对是 .../15.http/bin/www.js
    let filePath = path.join(this.directory, pathname) // this.directory: 插件运行的所在目录, pathname: url路径

    try {
      let statObj = await fs.stat(filePath)       // url路径匹配的绝对路径可能是错的, 结果既不是文件,也不是目录
      if (statObj.isFile()) {
        // 读文件,返回
        let content = await fs.readFile(filePath)
        res.end(content)
      } else {
        // 列出所有目录
      }
    } catch (error) {
      // 封装异常处理函数
      this.handleError(error, req, res)
    }
  }

  handleError(err, req, res) {
    console.log(err)
    res.statusCode = 404
    res.end('Not Found')
  }

  start() {
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(this.port, this.address, () => {
      console.log(`${chalk.yellow('Starting up hot-server, serving ./')}`)
      console.log(`  http://${this.address}:${chalk.green(this.port)}`)
    })
  }

}

module.exports = Server
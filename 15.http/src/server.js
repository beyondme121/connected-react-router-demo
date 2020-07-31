const Server = require('./application')

// 创建服务 返回实例
function createServer(defaultConfig) {
  let { port, directory, address } = defaultConfig
  let server = new Server({ port, directory, address })
  return server
}
module.exports = createServer
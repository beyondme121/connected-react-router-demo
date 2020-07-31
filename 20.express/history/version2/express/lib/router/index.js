const url = require('url')
function Router() {
  // 路由的实例属性
  this.stack = [
    // {
    //   method: 'get',
    //   path: '*',
    //   handler(req, res) {
    //     console.log(`Cannot ${req.method} ${req.url}`)
    //   }
    // }
  ]
}

Router.prototype.get = function (path, handler) {
  this.stack.push({
    path,
    method: 'get',
    handler
  })
}



Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url)
  const requestMethod = req.method.toLowerCase()
  // 这回i不能等于1, 因为处理不了的函数的职责交给了路由以外的app来处理
  for (let i = 0; i < this.stack.length; i++) {
    let { path, method, handler } = this.stack[i]
    if (pathname === path && requestMethod === method) {
      handler(req, res)
    }
  }
  // 如果都没有匹配上, 调用外部的传递进来的"处理不了"的函数
  out()
}

module.exports = Router
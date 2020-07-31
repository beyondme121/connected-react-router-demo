const http = require('http')
const url = require('url')
const Router = require('./router')

// 为了便于维护与扩展,使用类的方式, 外部通过new的方式创建实例
function Application() {
  this._router = new Router()
}

Application.prototype.get = function (path, handler) {
  this._router.get(path, handler)
}

Application.prototype.listen = function () {
  let server = http.createServer((req, res) => {

    function done() {
      console.log(`Cannot ${req.method} ${req.url}`)
    }
    this._router.handle(req, res, done)
    // let { pathname } = url.parse(req.url)
    // let requestMethod = req.method.toLowerCase()
    // for (let i = 1; i < this._router.stack.length; i++) {
    //   let { path, method, handler } = this._router.stack[i]
    //   if (pathname === path && requestMethod === method) {
    //     return handler(req, res)
    //   }
    // }
    // // 如果都没有匹配上,执行第一个router
    // return this._router.stack[0].handler(req, res)
  })
  server.listen(...arguments)
}

module.exports = Application
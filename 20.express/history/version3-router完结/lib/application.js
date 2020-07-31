const http = require('http')
const url = require('url')
const methods = require('methods')
const Router = require('./router')

// 为了便于维护与扩展,使用类的方式, 外部通过new的方式创建实例
function Application() {
  // this._router = new Router()
}

Application.prototype.lazy_route = function () {
  if (!this._router) {
    this._router = new Router()
  }
}

methods.forEach(method => {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazy_route()
    this._router[method](path, handlers)
  }
})

// Application.prototype.get = function (path, ...handlers) {
//   this._router.get(path, handlers)
// }

Application.prototype.listen = function () {
  let server = http.createServer((req, res) => {
    this.lazy_route()
    function done() {
      console.log(`Cannot ${req.method} ${req.url}`)
    }
    // 让路由系统自己处理路由
    this._router.handle(req, res, done)
  })
  server.listen(...arguments)
}

module.exports = Application
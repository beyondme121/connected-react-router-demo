const http = require('http')
const url = require('url')
const methods = require('methods')
const Router = require('./router')

// 为了便于维护与扩展,使用类的方式, 外部通过new的方式创建实例
function Application() {
  // this._router = new Router()
}

// 路由懒加载
Application.prototype.lazy_route = function () {
  if (!this._router) {
    this._router = new Router()
  }
}

// app.use(...) 参数不确定, 可能是两个, 也可能是一个, 也可能是多个, 所以干脆, 使用arguments
Application.prototype.use = function () {
  // 中间件是挂载到路由上的,所以要初始化路由系统
  this.lazy_route()
  // 注册中间件的工作交给路由
  this._router.use(...arguments)
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
const url = require('url')
const methods = require('methods')
const Layer = require('./layer')
const Route = require('./route')

function Router() {
  // 路由的实例属性
  this.stack = []
}

Router.prototype.use = function (path, handler) {
  let newPath = path
  if (typeof handler !== 'function') {
    newPath = '/'
  }
  console.log(arguments)
  Array.from(arguments).forEach(item => {
    if (typeof item === 'function') {
      let layer = new Layer(newPath, item)
      layer.route = undefined // 区别于路由
      this.stack.push(layer)
    }
  })
}

Router.prototype.route = function (path) {
  // 创建一个route, 其中有一个方法, 让实例中的栈stack中的函数依次执行
  let route = new Route()
  let layer = new Layer(path, route.dispatch.bind(route)) // 当路径匹配到会调用route的dispatch方法, 让route中的所有handler执行
  layer.route = route
  this.stack.push(layer)
  return route
}

// path: 用户定义的路径
// handlers: 用户定义的真实的处理方法
// Router.prototype.get = function (path, handlers) {
//   // 创造一个route
//   let route = this.route(path)
//   // 将用户的方法传到route.get里
//   route.get(handlers)
// }

methods.forEach(method => {
  Router.prototype[method] = function (path, handlers) {
    let route = this.route(path)
    route[method](handlers)
  }
})

Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url)
  // 根据请求路径, 在最外层路由中一个个的筛查路径, 如果匹配上就执行
  // 从第一个layer中查找
  let idx = 0
  const next = () => {
    if (idx >= this.stack.length) return out()
    let layer = this.stack[idx++]
    if (layer.match(pathname)) {
      if (!layer.route) {
        layer.handle_request(req, res, next)
      } else {
        if (layer.route.methods[req.method.toLowerCase()]) {
          layer.handle_request(req, res, next)
        } else {
          next()
        }
      }
    } else {
      next()
    }
  }
  next()
}

module.exports = Router
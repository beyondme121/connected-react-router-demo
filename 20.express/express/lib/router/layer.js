
// Layer类只存放路径 和 handler, 表示 每完成一个app.method('/',...)就是一层, 可以有多个函数,
// 每个router种放的是一个Layer, 每个Layer中放的是1个route

function Layer(path, handler) {
  this.path = path
  this.handler = handler
}
// 增加中间件的处理逻辑
// Layer.prototype.match = function (pathname) {
//   return this.path === pathname
// }

Layer.prototype.match = function (pathname) {
  if (this.path === pathname) {
    return true
  }
  if (!this.route) {
    if (this.path === '/') {
      return true
    }
    return pathname.startsWith(this.path + '/')
  }
  return;
}


Layer.prototype.handle_request = function (req, res, next) {
  return this.handler(req, res, next)
}

module.exports = Layer
const Layer = require('./layer')
const methods = require('methods')

function Route() {
  this.stack = []
  this.methods = {}
}

// Route.prototype.get = function (handlers) {
//   for (let i = 0; i < handlers.length; i++) {
//     let layer = new Layer('', handlers[i])
//     layer.method = 'get'
//     this.stack.push(layer)
//   }
// }

methods.forEach(method => {
  Route.prototype[method] = function (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      let layer = new Layer('', handlers[i])
      layer.method = method
      // 记录当前路由表都有哪些方法
      this.methods[method] = true // {get: true}
      this.stack.push(layer)
    }
  }
})

Route.prototype.dispatch = function (req, res, out) {
  let requestMethod = req.method.toLowerCase()
  let idx = 0
  const next = () => {
    if (idx >= this.stack.length) return out()
    let layer = this.stack[idx++]
    if (layer.method === requestMethod) {
      layer.handler(req, res, next)
    } else {
      next()
    }
  }
  next()
}

module.exports = Route
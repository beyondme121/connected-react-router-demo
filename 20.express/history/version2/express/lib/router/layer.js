
// Layer类只存放路径 和 handler, 表示 每完成一个app.method('/',...)就是一层, 可以有多个函数,
// 每个router种放的是一个Layer, 每个Layer中放的是1个route

function Layer(path, handler) {
  this.path = path
  this.handler = handler
}

module.exports = Layer
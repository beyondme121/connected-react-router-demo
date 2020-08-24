let id = 0
class Dep {
  constructor() {
    this.subs = []
    this.id = id++
  }

  depend() {
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }
  // 给dep上添加watcher
  addSub(watcher) {
    this.subs.push(watcher)
  }
  // 数据变更, 让所有的watcher调用自己的update方法, watcher敞开方法供dep调用
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}


let stack = []
// 属性依赖dep 要记住 在哪个watcher中使用了，也就是属性在哪个组件中
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget() {
  // Dep.target = null
  stack.pop()
  // 如果栈中有多个watcher 出栈后Dep.target  要指向数组中的最后一个watcher, 
  Dep.target = stack[stack.length - 1]
  console.log("stack: ", stack)
}


export default Dep
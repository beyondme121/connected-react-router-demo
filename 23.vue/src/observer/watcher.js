import { pushTarget, popTarget } from "./dep"

let id = 0
class Watcher {
  /**
   * @param {*} vm 
   * @param {*} exprOrFn: 可能是表达式 Vue.$set这种更新数据; 也可能是函数, 直接调用update(render)
   * @param {*} updateCallback: 更新后的callback
   * @param {*} options: 包含了是否为渲染watcher
   */
  constructor(vm, exprOrFn, updateCallback, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.updateCallback = updateCallback
    this.options = options
    this.deps = []
    this.depsId = new Set()
    this.id = id++
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.get()
  }

  // watcher记录dep
  addDep(dep) {
    // this.deps.push(dep)
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }

  get() {
    pushTarget(this)    // 把watcher实例给到Dep类去折腾. 在Dep.target = this
    // 渲染页面(1. 代码生成render 2. 生成DOM,挂载页面)
    this.getter()
    popTarget()
  }

  update() {
    this.get()
  }
}

export default Watcher
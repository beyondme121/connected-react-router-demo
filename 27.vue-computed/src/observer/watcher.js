import { pushTarget, popTarget } from "./dep"
import { nextTick } from "../utils"

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
    // 如果用户定义的watch属性或者直接调用vm.$watch(expr, cb)
    this.user = options.user
    // computed属性
    this.lazy = options.lazy; // 如果watcher上有lazy属性 说明是一个就算属性
    this.dirty = this.lazy; // dirty代表取值时是否执行用户提供的方法

    this.deps = []
    this.depsId = new Set()
    this.id = id++
    // watcher内部组件渲染或者更新都是render函数
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      // 用户自定义的watcher, 如watch: {a: fn}, vm.$watch(exprOrFn,handler,options) 中,exprOrFn通常是字符串(属性key值)
      this.getter = function () {
        let obj = vm
        let path = exprOrFn.split('.')
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    // 渲染watcher和watch中的watch默认都是会执行一次的, 当时computed的watcher是默认不执行的
    this.value = this.lazy ? void 0 : this.get()
    // this.value = this.get()
  }

  // watcher记录dep，去重
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
    let result = this.getter.call(this.vm)
    popTarget()
    return result
  }

  update() {
    if (this.lazy) {
      this.dirty = true // 设置为true表示需要更新
    } else {
      // this.get()
      queueWatcher(this)
    }
  }

  // 执行每个watcher
  run() {
    let oldValue = this.value
    let newValue = this.get()
    this.value = newValue
    if (this.user) {
      this.updateCallback.call(this.vm, newValue, oldValue)
    }
  }

  // 计算属性取值
  evaluate() {
    // 调用get, get方法有返回值result,取值当然有返回值
    this.value = this.get()
    this.dirty = false    // 取了一次值, 就不是dirty的了
  }

  depend() {
    // 拿出当前watcher的所有依赖项
    let i = this.deps.length;
    while (i--) {
      // 让每一个dep记录当前的渲染watcher
      this.deps[i].depend()
    }
  }
}

// 将需要批量更新的watcher存到一个队列中，稍后让watcher执行，存储watcher队列如果是同一个就不再存储了
let queue = []
let has = {}
let pending = false

// 刷新当前调度的队列，提出一层，然后queueWatcher中就不要写定时器了
function flushSchedulerQueue() {
  // 执行watcher队列 去重后的watcher队列
  queue.forEach(watcher => {
    watcher.run()
    // 如果不是用户watcher, 即如果是渲染watcher, 就执行cb
    if (!watcher.user) {
      console.log("render watcher cb:", watcher.cb)
      watcher.updateCallback()
    } else {
      console.log("user watcher.cb:", watcher.cb)
    }
  })
  // 执行完之后清空队列 准备下一次watcher队列的更新
  queue = []
  has = {}
  pending = false
}



// 更新队列
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      // setTimeout(() => {
      //   queue.forEach(watcher => watcher.run())  // 清空队列
      //   queue = []
      //   has = {}
      //   pending = false
      // }, 0);
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}

export default Watcher
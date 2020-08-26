import { observe } from "./observer/index.js"
import { proxy, nextTick } from "./utils.js"
import Watcher from "./observer/watcher.js"
import Dep from "./observer/dep.js"

export function initState(vm) {
  const opts = vm.$options
  // 根据不同的选项, 做不同的拆分处理, data如何处理, props如何处理等
  if (opts.props) {
    initProps(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
}

// data数据的初始化操作, 数据劫持
function initData(vm) {
  let data = vm.$options.data
  // data可能是函数, 也可能是对象, 函数就直接执行,结果返回对象,赋值给vm也是为了可以通过vue实例获取到数据劫持后的数据(引用)
  vm._data = data = typeof data === 'function' ? data.call(vm) : data

  // 当我去vm上取属性时 ，帮我将属性的取值代理到vm._data上
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}

function initProps() { }

// watch属性对象的作用就是数据属性变化了，执行watch监控的对应方法或者数组方法
function initWatch(vm) {
  let watches = vm.$options.watch
  for (let key in watches) {
    const handler = watches[key]
    if (Array.isArray(handler)) {
      handler.forEach(handle => createWatcher(vm, key, handle))
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

// 大部分情况下exprOrFn是watch中监控的属性名, 字符串, cb可能是函数，对象，字符串
function createWatcher(vm, exprOrFn, handler, options) {
  // console.log(exprOrFn, cb, options)
  if (typeof handler === 'object') {       // a: { handler () {...,deep, immediate: true, ...}}
    options = handler     // 把整个对象的配置都给options
    handler = handler.handler // 把执行的函数拿出来
  }
  if (typeof handler === 'string') {
    handler = vm[handler]   // method中的方法
  }
  // 其他都是key:fn
  // return new Watcher(vm, exprOrFn, handler, options)
  return vm.$watch(exprOrFn, handler, options)
}

function initComputed(vm) {
  const computed = vm.$options.computed
  const watchers = vm._computedWatchers = {}
  // debugger
  // 因为依赖的属性变更，计算属性要重新执行, 有依赖收集的功能, 内部实现了watcher，所以要重写computed的每一个属性,
  // 并且将属性改在到vm实例上，可以让组件通过this.计算属性获的形式 获取到这个值
  for (let key in computed) {
    const userDef = computed[key]     // 两种计算属性的写法 1. 函数 2. 对象
    // 获取get方法, 用于传递给watcher的 get属性, 即属性发生变更执行的函数
    const getter = typeof userDef == 'function' ? userDef : userDef.get;
    // 给每个计算属性增加一个watcher,保存的vm实例变量_computedWatchers上, watcers['fullName'] = watcher
    // 并且标识一下当前的watcher的类型是计算属性，是lazy的
    watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true })
    defineComputed(vm, key, userDef)
  }
}



// 这里没有写vm而是target表示的是: 可能是给Vue的实例挂属性, 也可能给组件实例挂属性
// 入参:userDef 可能是函数 或者是对象;如果是函数,处理成对象的形式. 定义sharedComputedProperty为对象,给对象增加get,set属性
function defineComputed(target, key, userDef) {
  const sharedComputedProperty = {}
  if (typeof userDef == 'function') {
    sharedComputedProperty.get = createComputedGetter(key)      // 调用get,就是执行usefDef函数
  } else {
    sharedComputedProperty.get = createComputedGetter(key)
    sharedComputedProperty.set = userDef.set
  }
  Object.defineProperty(target, key, sharedComputedProperty)
}


// 此方法是我们包装的方法，每次取值会调用此方法
function createComputedGetter(key) {
  // 取值时才会调用
  return function () {
    const watcher = this._computedWatchers[key] // 拿到这个属性对应的watcher
    if (watcher) {
      if (watcher.dirty) {    // 默认肯定是脏的，Watcher类初始化为true.
        watcher.evaluate()    // 对当前watcher求值
        // return watcher.value
      }
      // 
      if (Dep.target) { // 说明还有渲染watcher，也应该一并的收集起来
        watcher.depend()
      }
      // 如果不是dirty的，说明是新的，赶紧的，直接返回
      return watcher.value
    }
  }
}


export function stateMixin(Vue) {
  // 用户自定义cb,默认调用util中的nextTick, 共用同调用同一个
  Vue.prototype.$nextTick = function (cb) {
    nextTick(cb)
  }
  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    let watcher = new Watcher(this, exprOrFn, cb, { ...options, user: true })
    if (options.immediate) {
      cb()
    }
  }
}
import { observe } from "./observer/index.js"
import { proxy, nextTick } from "./utils.js"
import Watcher from "./observer/watcher.js"

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
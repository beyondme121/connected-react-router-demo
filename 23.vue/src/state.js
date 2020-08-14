import { observe } from "./observer/index.js"
import { proxy } from "./utils.js"

export function initState(vm) {
  const opts = vm.$options
  // 根据不同的选项, 做不同的拆分处理, data如何处理, props如何处理等
  if (opts.props) {
    initProps(vm)
  }
  if (opts.data) {
    initData(vm)
  }
}

function initProps() { }

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
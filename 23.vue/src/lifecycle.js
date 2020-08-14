// 生命周期也是一个插件, 需要在Vue实例的原型上挂载更新与render方法

import { patch } from "./vdom/patch"

export function mountComponent(vm, el) {
  callHook(vm, 'beforeMount')
  // 1. 生成虚拟DOM => vm._render() 2. 渲染真实节点vm._update
  // 都是vm实例上的方法, render和update都是组件生命周期的一部分, 抽离成一个lifecycle文件转换处理生命周期, 理念上与初始化平级别 init - lifecycle
  vm._update(vm._render())
  callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
  // 渲染页面
  Vue.prototype._update = function (vdom) {
    const vm = this
    patch(vm.$el, vdom)
  }
  // 生成虚拟DOM
  Vue.prototype._render = function () {
    const vm = this
    let render = vm.$options.render
    // 调用vm.$options.render方法, new Function(`with(this) { return ${code}}`)
    // 因为render方法的字符串表示中有类似 _c, _v这种函数调用, 作用域(通过with)指向了this, call(vm), 那么this就是vm. 实例上的方法, 原型方法, 
    let vdom = render.call(vm)
    // console.log("vdom,", vdom)
    return vdom
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]    // vm.$options[hook] = vm.$options.created = [a,b,created,...]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
import { initState } from "./state"
import { compileToFunctions } from "./compiler/index.js"
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from "./utils"

// 初始化
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 选项挂载到vue实例上
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)
    // console.log(vm.$options)

    callHook(vm, 'beforeCreate')
    // 初始化中一个个不同的功能
    // 1. 数据的初始化: 初始化状态, 数据响应式, 数据变更, 视图更新, 数据劫持
    initState(vm)

    callHook(vm, 'created')
    // 2. 初始化事件
    // 3. 数据渲染到页面
    // 如果有el属性, 说明需要渲染页面
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    // debugger
    const vm = this
    el = document.querySelector(el)
    vm.$el = el
    const options = vm.$options
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      // 将模板编译成render函数
      const render = compileToFunctions(template)
      options.render = render
    }
    // 挂载组件 属于生命周期的一部分 (创建VDOM和渲染真实节点的开始 vm上有render, el是被替换的DOM节点)
    mountComponent(vm, el)
  }
}
import { mergeOptions } from "../utils"
import initExtend from "./extend"

export function initGlobalApi(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // debugger
    this.options = mergeOptions(this.options, mixin)
  }


  // 1. 全局注册组件, 全局属性都挂载到Vue.options上
  // 2. 递归组件一定要加名字

  Vue.options.components = {} // 全局组件的配置记录在全局的options.components中
  Vue.options._base = Vue  // 最终的Vue的构造函数 保留在options对象中的_base

  // 初始化Vue.extend, 插件
  initExtend(Vue)

  /**
   * 
   * @param {*} id 定义组件的名字
   * @param {*} definition 组件的配置选项, 对象 {name: 'xxx', template: xx, data() {}, ...}
   */
  Vue.component = function (id, definition) {
    definition.name = definition.name || id
    definition = this.options._base.extend(definition) // 根据当前组件配置对象, 生成了一个子类的构造函数
    // Vue.component 注册组件 等价于  Vue.options.components[id] = definition
    Vue.options.components[id] = definition
  }



}
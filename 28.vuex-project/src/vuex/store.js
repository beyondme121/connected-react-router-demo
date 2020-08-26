import applyMixin from "./mixin";
import { forEachValue } from "./utils";

export let Vue;
export const install = _Vue => {
  Vue = _Vue      // 安装vuex时,入参_Vue赋值给了Vue, 外部作用域的Vue就是Vue了。
  applyMixin(Vue)
}

export class Store {
  constructor(options) {
    // 1. 实现状态 - 1. 获取配置的state 2. 实现state数据响应式
    const state = options.state
    const computed = {}



    // 2. getters实现 
    //  1. getters中每一个都是方法, 使用的时候是属性; 简单处理: 遍历选项, 给每个选项的key添加 get属性, 调用对应key的方法
    this.getters = {}
    // Object.keys(options.getters).forEach(key => {
    //   Object.defineProperty(this.getters, key, {
    //     get: () => {
    //       return options.getters[key](this.state)
    //     }
    //   })
    // })
    // 遍历getters所有的属性, 先遍历后实例化vue
    forEachValue(options.getters, (fn, key) => {
      // 遍历getters属性时, 都定义到computed上
      computed[key] = () => {
        return fn(this.state)
      }

      Object.defineProperty(this.getters, key, {
        // get: () => fn(this.state)
        get: () => this._vm[key]
      })
    })



    this._vm = new Vue({
      data: {
        $$state: state
      },
      computed
    })

  }

  get state() {
    return this._vm._data.$$state
  }

}
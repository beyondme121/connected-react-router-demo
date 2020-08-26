import { mergeOptions } from "../utils"

export default function initExtend(Vue) {
  let cid = 0;
  // extendOptions: 用户自定义的组件options: template, data,...
  Vue.extend = function (extendOptions) {
    const Super = this
    // 根据配置选项, 生成一个子类的构造函数
    const Sub = function VueComponent(options) {
      console.log("in Sub this:", this)
      this._init(options)
    }
    Sub.cid = cid++;
    console.log("Super.options: ", Super.options)
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    console.log("Sub.options: ", Sub.options)
    Sub.components = Super.components
    return Sub
  }
}
import { mergeOptions } from "../utils"

export function initGlobalApi(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // debugger
    this.options = mergeOptions(this.options, mixin)
  }
}
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"
import { initGlobalApi } from "./global-api/index"
import { stateMixin } from "./state"


function Vue(options) {
  this._init(options)
}

// 扩展原型
// 初始化方法
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)
// 扩展Vue静态方法
initGlobalApi(Vue)

export default Vue




import Vue from 'vue'
import Vuex from 'vuex'
import rootModule from './rootModule'
Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)
files.keys().forEach(key => {
  // 1. 每个子模块的名字
  let moduleName = key.replace(/\.\//, '').replace(/\.js$/, '')
  // 2. store配置(state, mutations,...)
  let store = files(key).default
  // 3. 判断rootModule是否有modules 选项, 引用类型 改了module就等于改了rootModule
  let module = rootModule.modules = rootModule.modules || {}
  // 4. 将配置赋值给modules中的一个选项
  module[moduleName] = store
  // 5. 设置命名空间, 否则每个子模块都是全局的 , 不加空间没有作用域
  module[moduleName].namespaced = true
  console.log("module", module)
})
// console.log(rootModule)
export default new Vuex.Store(rootModule)

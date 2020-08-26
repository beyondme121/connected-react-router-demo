// 负责插件安装中的一个子功能: 将options中的store混入到vue实例和组件实例上
const applyMixin = Vue => {
  Vue.mixin({
    beforeCreate: vuexInit
  })
}

function vuexInit() {
  const options = this.$options // 根实例或者组件实例的options
  if (options.store) {          // 判断根实例
    // 给根实例增加$store属性
    this.$store = options.store
  } else if (options.parent && options.parent.$store) {   // 组件实例的options默认有parent属性
    // 给组件增加$store属性 将store实例定义在所有的组件实例上
    this.$store = options.parent.$store
  }
}

export default applyMixin
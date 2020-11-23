import Vue from 'vue'
import VueRouter from 'vue-router'
import hooks from './hooks'
Vue.use(VueRouter)

const routes = []
const filesFn = require.context('./routers', false, /\.router.js$/)
filesFn.keys().forEach(key => {
  // key == './article.router.js' => filesFn(key).default => 就是配置对象数组
  routes.push(...filesFn(key).default)
})

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 执行所有的hooks, 路由钩子可以有很多个, 每个都代表着不同的功能
Object.values(hooks).forEach(hook => {
  // 绑定hook中的this是路由的实例  
  router.beforeEach(hook.bind(this))
})


export default router

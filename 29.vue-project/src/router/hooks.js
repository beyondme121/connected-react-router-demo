import store from '../store/index'
import * as types from '../store/action-types'
export default {
  // 切换路由, 取消所有的ajax请求, 请求保存在store中
  "cancelToken": async function (to, from, next) {
    // 取消所有的ajax请求
    store.state.ajaxTokens.forEach(fn => fn())
    // 清空ajax请求数组
    store.commit(types.SET_CLEAR_REQUEST_TOKEN, '')
    next()
  },
  // 每次路由切换都执行 验证登录权限
  "loginPermission": async function (to, from, next) {
    await store.dispatch(`user/${types.SET_USER_VALIDATE}`)

    if (store.state.user.hasPermission) {
      if (to.path == '/login') {
        next('/')
      } else {
        next()
      }
    } else {
      // 如果没有登录, 看一下哪些接口可以无权限访问, 在路由配置中设置meta: needLogin
      let needLogin = to.matched.some(item => item.meta.needLogin)
      if (needLogin) {
        next('/login')
      } else {
        next()
      }
    }
  },
  // 切换路由, dispatch action 用于获取用户的权限并动态加载路由
  "menuPermission": async function (to, from, next) {
    // 如果用户登录了
    if (store.state.user.hasPermission) {
      if (!store.state.user.menuPermission) {
        // debugger
        store.dispatch(`user/${types.SET_ROUTE}`)
        next({ ...to, replace: true })
      } else {
        next()  // 已经获取过了菜单权限了， 或者页面加载完毕后
      }
    } else {
      next()
    }
  }

}
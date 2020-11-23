import * as types from '../action-types'
import * as api from '@/api/user'
import { setLocal, getLocal } from '../../utils/local'
import { filterRouter } from '../../utils/common'
import permissionRoutes from '../../router/permission'
import router from '../../router/index'

export default {
  state: {
    userInfo: {},
    hasPermission: false,    // 默认没有登录
    menuPermission: false,   // 默认没有处理菜单(是否处理过动态加载路由)
    btnPermission: {
      'edit': true,
      'delete': false
    }
  },
  mutations: {
    [types.SET_USER](state, payload) {
      state.userInfo = payload
      // 1. 登录信息保存到local中, 用于用户每次请求服务器时,拿着local中的token, 放在请求头上携带token请求
      if (payload && payload.token) {
        setLocal('token', payload.token)
      }
    },
    [types.SET_USER_PERMISSION](state, has) {
      state.hasPermission = has
    },
    [types.SET_MENU_PERMISSION](state, has) {
      // debugger
      state.menuPermission = has
    }
  },
  actions: {
    async [types.SET_USER_LOGIN]({ commit }, options) {
      try {
        let userInfo = await api.login(options)
        commit(types.SET_USER, userInfo)
        commit(types.SET_USER_PERMISSION, true)
      } catch (e) {
        commit(types.SET_USER_PERMISSION, false)
        return Promise.reject(e)
      }
    },

    // 验证用户是否登录
    async [types.SET_USER_VALIDATE]({ commit }, payload) {
      if (!getLocal('token')) return
      try {
        let result = await api.validate() // 验证token, 浏览器携带token, 返回用户信息
        commit(types.SET_USER, result)
        commit(types.SET_USER_PERMISSION, true)  // 用户验证也要增加
      } catch (error) {
        commit(types.SET_USER, {})
        commit(types.SET_USER_PERMISSION, false)
      }
    },

    // 给用户授过权的菜单 添加到路由表中
    async [types.SET_ROUTE]({ commit, state }) {
      let authList = state.userInfo.authList  // 从状态中获取userInfo
      if (authList) {
        // 用户权限表和路由表匹配
        let routes = filterRouter(permissionRoutes, authList)
        // 找到管理的路由, routers/manager.router.js的配置, 
        let route = router.options.routes.find(route => route.path === '/manager')
        // 给route添加children属性, 都放在manager路径下
        route.children = routes // 给她添加孩子
        router.addRoutes([route]) // 把最新的放到路由中
        commit(types.SET_MENU_PERMISSION, true)  // 表示已经设置完菜单权限了
      } else {
        commit(types.SET_MENU_PERMISSION, true)
      }
    }
  }
}
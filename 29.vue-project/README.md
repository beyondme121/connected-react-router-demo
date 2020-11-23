## 1. vuex 模块划分


## 2. 验证码
1. 页面加载生成uuid, 并保存到local中
2. 拿着uuid 去请求验证码, 后端记录这个uuid 和 生成的验证码 [{id: uuid, value: 验证码}]
3. 后端把验证码的svg返回给客户端进行展示 <div v-html="svg">
4. 用户填写表单, 点击提交, 验证表单信息之外，还要验证验证码的正确性, 提交信息中要把当前的uuid(保存在本地的)传递给后端,用于验证唯一性,
   一个uuid 对应着一个 验证码。 验证码可以一直使用localStorage中的, 验证码是当前请求后的, 点击刷新验证码,就会得到新的验证码, 后端存一下, 失效过期, 就是把这个数据存到了redis中




## 3. 全局loading效果
- 通过请求队列, 如果queue中没有请求url, 把loading效果加上, 请求结束了, 删除队列中的url. 如果队列中没有请求url了，说明都请求完了，就删除loading效果
- 如果希望对某些不做loading效果, 加白名单

```js
constructor() {
    this.timeout = 3000
    this.baseURL = process.env.NODE_ENV === 'development' ? config.dev : config.prod
    this.queue = {}
}


setInterceptor(instance, url) {
  // 请求拦截器
  instance.interceptors.request.use(config => {
    if (Object.keys(this.queue).length == 0) {
      loadingInstance = Loading.service({ fullscreen: true })
    }
    this.queue[url] = true
    return config
  })

  instance.interceptors.response.use(res => {
    // 全局loading
    delete this.queue[url]
    if (Object.keys(this.queue).length == 0) {
      loadingInstance.close()
    }
    if (res.status === 200) {
      if (res.data.err == 1) {
        return Promise.reject(res.data)
      }
      return Promise.resolve(res.data.data)
    } else {
      return Promise.reject(res)
    }
  }, err => {
    // 全局loading
    delete this.queue[url]
    if (Object.keys(this.queue).length == 0) {
      loadingInstance.close()
    }
    return Promise.reject(err)
  })
}
```



## 4. 请求取消功能
- 做一个请求队列 this.queue = {}
- 拦截器中, 请求拦截器将请求的url记录到queue中, 在响应拦截器再删除这个url对应属性  {'/public/slider': true, '/user/login': true}
- 当页面时，删除不必要的请求。切换页面的时候, 请求还没有完成, 删除这些请求
- 把所有请求token, 用于取消的token放在全局上 vuex
- 页面切换时，把cancelToken依次执行


1. 请求前记录cancelToken

```js
// 请求拦截器
instance.interceptors.request.use(config => {
  // 记录取消token
  let Cancel = axios.CancelToken
  // 把实例化后的token保存到全局 store中
  new Cancel(function (c) {
    store.commit(types.SET_REQUEST_TOKEN, c)
  })

  return config
})

```

2. 将token保存到store中

```js
export const SET_REQUEST_TOKEN = 'SET_REQUEST_TOKEN'
export const SET_CLEAR_REQUEST_TOKEN = 'SET_CLEAR_REQUEST_TOKEN'

// rootModule.js/ mutations
import * as types from './action-types'
export default {
  state: {
    ajaxTokens: []
  },
  mutations: {
    [types.SET_REQUEST_TOKEN](state, payload) {
      state.ajaxTokens = [...state.ajaxTokens, payload]
    },
    [types.SET_CLEAR_REQUEST_TOKEN](state, payload) {
      state.ajaxTokens = []
    }
  },
}
```

3. 路由切换, 路由钩子, 每个钩子函数实现一个具体的功能, 有很多个钩子 hooks

```js
import store from '../store/index'
export default {
  // 切换路由, 取消所有的ajax请求, 请求保存在store中
  "cancelToken": async function (to, from, next) {
    // 取消所有的ajax请求
    store.state.ajaxTokens.forEach(fn => fn())
    // 清空ajax请求数组
    store.commit(types.SET_CLEAR_REQUEST_TOKEN, '')
    next()
  }
}
```

4. 路由切换执行hook

```js
import hooks from './hooks'
// router/index.js
// 执行所有的hooks, 路由钩子可以有很多个, 每个都代表着不同的功能
Object.values(hooks).forEach(hook => {
  // 绑定hook中的this是路由的实例  
  router.beforeEach(hook.bind(this))
})

```



## 5. 登录

### 1. 将后端返回的token保存到local中, 用户信息保存在store中

> 用户请求的api

```js
import * as config from './config'
import axios from '@/utils/axios'

export const login = (options) => {
  let { username, password, code, uid } = options
  if (username && password && code && uid) {
    return axios.post(config.login, options)
  }
}
```

> 请求的actions

```js
actions: {
    async [types.SET_USER_LOGIN]({ commit }, options) {
        try {
            let userInfo = await api.login(options)
            commit(types.SET_USER, userInfo)
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
```

> 调用的mutation: 保存用户信息到 1. store 2. local中

```js
mutations: {
    [types.SET_USER](state, payload) {
        state.userInfo = payload
        // 1. 登录信息保存到local中, 用于用户每次请求服务器时,拿着local中的token, 放在请求头上携带token请求
        if (payload && payload.token) {
            setLocal('token', payload.token)
        } else {
            return false
        }
    }
},
```



### 2. 每次请求带上token

header上带上token，有些请求不需要带着token, 比如public，只有需要鉴权的才携带。公共资源可以不带着token。

token可以保存在local，也可以cookie中。只有cookie可以跨父子域，local不行。

```js
instance.interceptors.request.use(config => {
	// 请求携带token, 没有就没有,就是空
	config.headers.authorization = 'Bearer ' + getLocal('token')
}
```



### 3. token保存在cookie中还是local中

http://blog.itpub.net/10742815/viewspace-2142725/



### 4. 页面引入store的用户信息




### 5. 根据登录状态修改页面显示

```vue
<template v-if="!userInfo.username">
    <el-menu-item index="/login">登录</el-menu-item>
    <el-menu-item index="/reg">注册</el-menu-item>
</template>
<template v-else>
    <el-submenu>
        <template slot="title">{{userInfo.username}}</template>
    	<el-menu-item>退出登录</el-menu-item>
    </el-submenu>
</template>
```


### 6. 登录成功后, 刷新或切换路由保持登录状态

> 页面刷新，路由切换，都要重新拉取用户的权限，因为要保证用户权限是最新的。因为token可能会过期

1. 每次切换或刷新（路由钩子），调用验证权限的api接口

```js
// config.js
export const validate = '/user/validate'

// api
export const validate = () => axios.get(config.validate)


// actions
// 验证用户是否登录
async [types.SET_USER_VALIDATE]({ commit }, payload) {
    if (!getLocal('token')) return
    try {
        let result = await api.validate() // 验证token, 浏览器携带token, 返回用户信息
        commit(types.SET_USER, result)
    } catch (error) {
        commit(types.SET_USER, {})
    }
}

// action-types.js
export const SET_USER_VALIDATE = 'SET_USER_VALIDATE'

// actions的执行位置, 每次路由切换 hooks.js
export default {
  // 每次路由切换都执行 验证登录权限
  "loginPermission": async function (to, from, next) {
    await store.dispatch(`user/${types.SET_USER_VALIDATE}`)
    next()
  }
}
```



### 7. 登录后不能访问login页面

设置一个字段，用于标识是否有登录。当然也可以使用userInfo中的某个字段标识, 比如token等

判断如果hasPermisson, 那用户访问/login就next('/')，如果没有权限，



```js
import * as types from '../action-types'
import * as api from '@/api/user'
import { setLocal, getLocal } from '../../utils/local'
export default {
  state: {
    hasPermission: false,    // 默认没有登录
  },
  mutations: {
    [types.SET_USER_PERMISSION](state, has) {
      state.hasPermission = has
    }
  },
  actions: {
    async [types.SET_USER_LOGIN]({ commit }, options) {
      try {
        let userInfo = await api.login(options)
        commit(types.SET_USER, userInfo)
        commit(types.SET_USER_PERMISSION, true)   // +++++
      } catch (e) {
        commit(types.SET_USER_PERMISSION, false)  // +++++
        return Promise.reject(e)
      }
    },
  }
}
```



```js
export const SET_USER_PERMISSION = 'SET_USER_PERMISSION'
```

- 在路由钩子验证登录状态时, 判断是否有登录, 登录成后后请求/login，就返回首页 /

```js
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
		let needLogin = to.matched.some(item => item.needLogin)
        if (needLogin) {   // 需要登录 但是没有权限 hasPermission = false
            next('/login')
        } else {
            next()    // 没有权限，也不需要登录, 放行
        }
    }

    next()
},
```

- router配置

```js
export default [
  {
    path: '/post',
    component: () => import('@/views/Article/post.vue'),
    meta: {
      needLogin: true
    }
  }
]
```





## 6. 管理页面

- views目录下创建所有管理页面的页面组件
- 配置router, router/routers/manager.router.js, 当路由访问/manager，路由动态加载@/views/Manager/index.vue

```js
export default [
  {
    path: '/manager',
    component: () => import('@/views/Manager/index.vue')
  }
]
```

- 修改header组件

```vue
<template v-else>
    <el-submenu>
        <template slot="title">{{userInfo.username}}</template>
        <el-menu-item index="/manager">管理页面</el-menu-item>
        <el-menu-item>退出登录</el-menu-item>
    </el-submenu>
</template>
```



**问题**

1. 有些用户是普通用户，根本就**看不到管理页面**，那么这些管理页面就不需要加载



### 1.菜单权限



准备条件

1. 菜单树
2. 用户菜单权限
3. 匹配两个权限，动态添加有权限的路由
4. 路由切换, 执行store/actions，动态添加路由



### 2. 给用户授过权的菜单 添加到路由表中

```js
import { filterRouter } from '../../utils/common'
import permissionRoutes from '../../router/permission'
import router from '../../router/index'

// actions.js
// 给用户授过权的菜单 添加到路由表中
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
```



mutations

```js
mutations: {
    [types.SET_MENU_PERMISSION](state, has) {
      state.menuPermission = has
    }
},
```



路由钩子配置项

```js
// 切换路由, dispatch action 用于获取用户的权限并动态加载路由
"menuPermission": async function (to, from, next) {
    // 如果用户登录了
    if (store.state.user.hasPermission) {
        if (!store.state.user.menuPermission) {
            // debugger
            store.dispatch(`user/${types.SET_ROUTE}`)
            next({ ...to, replace: true })  // hack
        } else {
            next()  // 已经获取过了菜单权限了， 或者页面加载完毕后
        }
    } else {
        next()
    }
}
```



功能方法 utils/common

```js
// 匹配路由, 从routes中筛选searchRoutes中存在的
export const filterRouter = (routes, searchRoutes) => {
  let auths = searchRoutes.map(item => item.auth)
  // 递归查找
  function filter(routes) {
    return routes.filter(route => {
      if (auths.includes(route.meta.auth)) {
        // 匹配上了权限后, 看当前匹配上的路由有没有children
        if (route.children) {
          route.children = filter(route.children)
        }
        return route
      }
    })
  }
  return filter(routes)
}
```



菜单表 menuPermission

```js
export default [{
        path: 'userStatistics',
        meta: {
            auth: 'userStatistics'
        },
        name: 'userStatistics',
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/userStatistics.vue')
    },
    {
        path: 'userAuth',
        meta: {
            auth: 'userAuth'
        },
        name: 'userAuth',
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/userAuth.vue')
    },
    {
        path: 'infoPublish',
        meta: {
            auth: 'infoPublish'
        },
        name: 'infoPublish',
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/infoPublish.vue')
    },
    {
        path: 'articleManager',
        meta: {
            auth: 'articleManager'
        },
        name: 'articleManager',
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/articleManager.vue')
    },
    {
        path: 'personal',
        name: 'personal',
        meta: {
            auth: 'personal'
        },
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/personal.vue')
    },
    {
        path: 'myCollection',
        meta: {
            auth: 'myCollection'
        },
        name: 'myCollection',
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/myCollection.vue')
    },
    {
        path: 'privateMessage',
        meta: {
            auth: 'privateMessage'
        },
        name: 'privateMessage',
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/privateMessage.vue')
    },
    {
        path: 'myArticle',
        meta: {
            auth: 'myArticle'
        },
        name: 'myArticle',
        component: () => import( /*webpackChunkName:'manager'*/ '@/views/Manager/myArticle.vue')
    }
]
```



## 7.  动态菜单

```jsx
import { createNamespacedHelpers } from 'vuex'
let { mapState } = createNamespacedHelpers('user')
export default {
  data() {
    return { menuTree: [] }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    let authList = this.userInfo.authList
    let mapping = {}
    authList.forEach(item => {
      item.children = []
      mapping[item.id] = item
      if (item.pid == -1) {
        this.menuTree.push(item)
      } else {
        mapping[item.pid] && mapping[item.pid].children.push(item)
      }
    })
  },
  render() {
    const renderChildren = tree => {
      return tree.map(item => {
        return item.children.length ? <el-submenu index={item._id}>
          <div slot="title">{item.name}</div>
          {renderChildren(item.children)}
        </el-submenu> :
          <el-menu-item index={item.path}>{item.name}</el-menu-item>
      })
    }

    return <el-menu background-color="#2a2a2a" text-color="#fff" active-text-color="#fff" router={true}>
      {renderChildren(this.menuTree)}
    </el-menu>
  }
}
```



views/index.vue

```vue
<template>
  <div>
    管理页面
    <ManagerMenu></ManagerMenu>hello world
    <router-view></router-view>
  </div>
</template>
<script>
import ManagerMenu from "@/components/ManagerMenu.jsx";
export default {
  components: {
    ManagerMenu,
  },
};
</script>
```





## 8. 按钮权限

store中用户的按钮的权限

```js
state: {
    userInfo: {},
    hasPermission: false,    // 默认没有登录
    menuPermission: false,   // 默认没有处理菜单(是否处理过动态加载路由)
    btnPermission: {
      'edit': true,
      'delete': false
    }
  },
```



全局指令

```js
Vue.directive('has', {
  inserted(el, binding, vnode) {
    let vm_comp = vnode.context
    let exists = vm_comp.$store.state.user.btnPermission[binding.value]
    if (!exists) {
      el.parentNode.removeChild(el)
    }
  }
})
```



```vue
<template>
  <div>
    <h3>post</h3>
    <button v-has="'edit'">edit</button>
    <button v-has="'delete'">delete</button>
  </div>
</template>

```


## 流程
- Router容器
- Route 路由规则
- 区分 BrowserRouter HashRouter 这两个react-router-dom的组件 适用于浏览器 是路由中顶层组件 向下级组件传递props 如history
- 通过React.createContext({})传递, Context.Proivder value={routeConfig} => config包含了 history对象,location, match

- BrowserRouter 和 HashRouter区别就是使用哪种路由操作的api => createBrowserHistory(props) 还是 createHashHistory
- 通过上下文传递props是在react-router中的Router组件统一处理, 接收不同的平台传过来的history



### 获取上下文 context
- 类组件: 声明静态变量
```js
import React from 'react'
import RouterContext from './RouterContext'

class Route extends React.Component {
  // 类组件 获取context的方式之一
  static contextType = RouterContext
  render() {
    let { history, location } = this.context
    let { path, component: RouteComponent } = this.props
    let match = location.pathname === path
    let routeConfig = {
      history,
      location,
    }
    if (match) {
      return <RouteComponent {...routeConfig} />
    }
    return null
  }
}
export default Route
```

- Consumer组件 传递函数
> Consumer的用法: 子元素接收一个函数, 参数就是context, 就是Provider提供的value值
```js
import React from 'react'
import RouterContext from './RouterContext'
class Route extends React.Component {
  render() {
    
    return (
      <RouterContext.Consumer>
        {(contextValue) => {
          // contextValue就是路由容器 Router通过上下文传递的value值{location,history,match}
          let { history, location } = contextValue
          // 通过组件的出行传递进来<Route path="..." component={Xxx}/>
          let { path, component } = this.props
          let match = location.pathname === path
          let routeProps = {
            history,
            location,
            match,
          }
          if (match) {
            return React.createElement(component, routeProps)
          }
        }}
      </RouterContext.Consumer>
    )
  }
}
export default Route
```


## history实现
- 实现createBrowserHistory
- 实现createHashHistory


## 路由规则的匹配


## 实现受保护的路由
- 通过使用render属性, 接收函数, 函数参数是Route中的所有props
  
```js
// Admin组件式有权限限制的, 只有登录并且管理员等一系列权限判断才能访问Admin组件
<组件名 path="/admin" component={Admin}/>
```

```js
import React from 'react'
import { Route, Redirect } from '../react-router-dom'
const Protected = props => {
  let { path, component: RouteComponent } = props
  return (
    <Route path={path}
      render={
        routeProps => {
          let isLogin = localStorage.getItem('login')
          if (isLogin) {
            return <RouteComponent {...routeProps} />
          } else {
            return <Redirect to={{ pathname: '/login', state: { from: path } }} />
          }
        }
      }
    />
  )
}
export default Protected
```


## 路由匹配规则渲染组件的三种方式
> 公共的属性就是path, url的pathname与路由规则的path路径的匹配


- 直接给component={组件} 直接渲染组件
- render属性: 接收Route组件内部传递的props 这个props是Router组件通过context向下级组件传递的Router全局的对象 {history, location,match}
- children属性: 无论是否匹配路径都会渲染组件, 前提是不适用Switch进行包裹, 直接在Route组件中作为props属性 <Route path="/xxx" children={() => {}}>
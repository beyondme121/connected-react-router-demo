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

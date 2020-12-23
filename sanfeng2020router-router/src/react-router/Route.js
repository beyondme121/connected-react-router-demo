// 1. Consumer的实现方式 => Consumer组件内部传递函数 接收context
// import React from 'react'
// import RouterContext from './RouterContext'
// class Route extends React.Component {
//   render() {
//     // Consumer的用法: 子元素接收一个函数, 参数就是context, 就是Provider提供的value值
//     return (
//       <RouterContext.Consumer>
//         {(contextValue) => {
//           // contextValue就是路由容器 Router通过上下文传递的value值{location,history,match}
//           let { history, location } = contextValue
//           // 通过组件的出行传递进来<Route path="..." component={Xxx}/>
//           let { path, component } = this.props
//           let match = location.pathname === path
//           let routeProps = {
//             history,
//             location,
//             match,
//           }
//           if (match) {
//             return React.createElement(component, routeProps)
//           }
//         }}
//       </RouterContext.Consumer>
//     )
//   }
// }
// export default Route

import React from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'
class Route extends React.Component {
  // 类组件 获取context的方式之一
  static contextType = RouterContext

  render() {
    let { history, location, match } = this.context // 获取默认的上下文
    let {
      path,
      component: RouteComponent,
      computedMatch, // 路径匹配 Switch组件向下级组件传递的属性, 用于当匹配了路径就返回, 传递这个参数为了优化缓存
      render,
      children,
    } = this.props
    // let match = location.pathname === path
    match = computedMatch
      ? computedMatch
      : matchPath(location.pathname, this.props)
    let routeConfig = {
      history,
      location,
    }
    let element
    if (match) {
      // 如果路由匹配上, 更新路由的match属性对象
      routeConfig.match = match
      if (children) {
        element = children(routeConfig) // 给children函数传递route配置对象
      } else if (RouteComponent) {
        // 通过props传递给Route的渲染组件, 我们还需要通过上下文
        element = <RouteComponent {...routeConfig} />
      } else if (render) {
        element = render(routeConfig)
      } else {
        element = null
      }
    } else {
      if (children) {
        element = children(routeConfig)
      } else {
        element = null
      }
    }

    return (
      <RouterContext.Provider value={routeConfig}>
        {element}
      </RouterContext.Provider>
    )
  }
}
export default Route

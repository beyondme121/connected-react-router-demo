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

class Route extends React.Component {
  // 类组件 获取context的方式之一
  static contextType = RouterContext

  render() {
    // console.log('this.context', this.context)
    const { history, location } = this.context
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

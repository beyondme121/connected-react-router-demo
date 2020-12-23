import React from 'react'
import RouterContext from './RouterContext'

// 高阶组件, 装饰老组件 添加路由信息
// function withRouter(OldComponent) {
//   return (props) => {
//     let context = React.useContext(RouterContext) // 只包含了history 和 location
//     return <OldComponent {...props} {...context} />
//   }
// }

function withRouter(OldComponent) {
  return (props) => {
    return (
      <RouterContext.Consumer>
        {(contextValue) => {
          return <OldComponent {...props} {...contextValue} />
        }}
      </RouterContext.Consumer>
    )
  }
}

export default withRouter

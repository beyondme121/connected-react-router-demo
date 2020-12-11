// 受保护的组件 权限控制 加复杂逻辑, 对Route规则的一次封装


import React from 'react'
import { Route, Redirect } from '../react-router-dom'
const Protected = props => {
  let { path, component: RouteComponent } = props
  return (
    <Route path={path}
      render={
        routeProps => {
          console.log("routeProps", routeProps) // 
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
























// import React from 'react'
// import { Route, Redirect } from '../react-router-dom'

// // 包装Route 路由规则的组件
// const Protected = props => {
//   let { path, component: RouteComponent } = props
//   return (
//     <Route
//       path={path}
//       render={
//         routeProps => {
//           return localStorage.getItem('login') ?
//             <RouteComponent {...routeProps} /> :
//             <Redirect to={{ pathname: '/login', state: { from: path } }} />
//         }
//       }
//     />
//   )
// }

// export default Protected

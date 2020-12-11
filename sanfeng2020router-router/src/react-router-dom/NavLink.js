import React from 'react'
import { Route, Link } from './'
// NavLink的功能是:
/**
 * 1. 导航栏: 最终渲染是a标签
 * 2. 当被选中时, 高亮显示, 没有选中, 不高亮
 *    无论是否选中或者路径是否匹配上, 都要显示. 这就用到了children属性 <Route children/>
 */

function NavLink(props) {
  // 如果是对象取pathname 否则直接就是路径字符串
  let to = typeof props.to === 'object' ? props.to.pathname : props.to
  return (
    <Route
      path={to}
      children={(routeProps) => {
        let style = {}
        if (routeProps.match) {
          style.backgroundColor = 'red'
          style.color = 'green'
        }
        return (
          <Link {...props} {...routeProps} style={style}>
            {props.children}
          </Link>
        )
      }}
    />
  )
}
export default NavLink

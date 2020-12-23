import React from 'react'
import { __RouterContext as RouterContext, matchPath, Link } from './'
// NavLink的功能是:
// 路径匹配成功 加activeClass activeStyle

function NavLink(props) {
  const context = React.useContext(RouterContext)
  let { pathname } = context.location
  // 解构NavLink的属性 <NavLink to='/user' className="blueBg" />
  let {
    to: path,
    className: classNameProps = '',
    activeClassName = 'active',
    style: styleProps = {},
    activeStyle = {},
    children,
    exact,
  } = props
  let isActive = matchPath(pathname, { path, exact })
  let className = isActive
    ? joinClassName(classNameProps, activeClassName)
    : classNameProps
  let style = isActive ? { ...styleProps, ...activeStyle } : styleProps
  // 组装NavLink的属性
  let linkProps = {
    className,
    style,
    to: path,
    children,
  }
  return <Link {...linkProps} />
}

function joinClassName(...classnames) {
  // filter的作用是去掉空格, 然后用空格连接
  return classnames.filter((c) => c).join(' ')
}
export default NavLink

import React from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'

class Switch extends React.Component {
  static contextType = RouterContext
  render() {
    let { location } = this.context
    // 获取所有Switch的子组件 即 Route组件
    let { children } = this.props
    children = Array.isArray(children) ? children : [children]
    for (let i = 0; i < children.length; i++) {
      if (React.isValidElement(children[i])) {
        let match = matchPath(location.pathname, children[i].props)
        if (match) {
          return React.cloneElement(children[i], {
            ...children[i].props,
            computedMatch: match,
          })
        }
      }
    }
    // 如果url路径pathname 和 props.path没有匹配上 什么也不做
    return null
  }
}
export default Switch

import React from 'react'
import RouterContext from './RouterContext'

// Router是没有match的, 为了让这个组件有match, 原始存储在Route和Switch 源自路由匹配才会有match
// Router 是 其他平台组件的子组件 各平台继续封装Router组件  浏览器  native
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/',
    }
  }
  constructor(props) {
    super(props)
    // 保存路由容器的基本信息 location
    this.state = {
      location: props.history.location,
    }
    // 监听事件, 如果url地址变化了, 就将最新的location保存到状态中
    this.unlisten = props.history.listen((location) => {
      console.log('location change', location)
      this.setState({ location })
    })
  }

  // 组件卸载执行取消监听
  componentWillUnmount() {
    this.unlisten && this.unlisten()
  }

  render() {
    let value = {
      history: this.props.history,
      location: this.state.location,
      match: Router.computeRootMatch(this.state.location.pathname),
    }
    return (
      <RouterContext.Provider value={value}>
        {this.props.children}
      </RouterContext.Provider>
    )
  }
}

export default Router

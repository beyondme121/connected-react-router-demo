// 创建一个对象 可以操作url路径的行为
function createBrowserHistory() {
  // 浏览器的history对象
  let globalHistory = window.history
  let listeners = []
  function go(n) {
    globalHistory.go(n)
  }
  function goBack() {
    go(-1)
  }
  function goForward() {
    go(1)
  }

  // 只要有url变化, 就保存监听的事件处理函数 listener, 返回一个取消监听的函数, 就是把当前的监听函数从历史栈中排除出去
  function listen(listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((item) => item !== listener)
    }
  }

  // 更新全局的history对象
  function setState(newState) {
    Object.assign(history, newState)
    history.length = globalHistory.length
    // 每个监听事件处理函数都接收location参数,
    // 也就是Router.js中的 props.history.listen(newLocation => {更新location})
    listeners.forEach((listener) => listener(history.location))
  }

  // 向路由栈中添加路径, 并更新history对象中的属性
  // push的用法有2种, 字符串和对象 {pathname: '/user', state={}} 如果是对象，方便传递路由的数据
  function push(pathname, state) {
    let action = 'PUSH'
    if (typeof pathname === 'object') {
      state = pathname.state
      pathname = pathname.pathname
    }
    globalHistory.pushState(state, null, pathname)
    // 因为调用push就会修改history对象中的属性, 所以要同步一下history对象
    // 更新history对象中的location, action两个属性
    let location = { state, pathname }
    setState({ action, location })
  }

  // console.log('globalHistory,', globalHistory)
  // length: 11
  // scrollRestoration: "auto"
  // state: null
  // 原型上有pushState等原生方法

  let history = {
    action: 'POP',
    go,
    goBack,
    goForward,
    listen, // 监听url地址变化的函数 接收一个 事件处理函数 也就是监听器
    location: {
      pathname: window.location.pathname,
      state: globalHistory.state,
    },
    push,
  }
  return history
}

export default createBrowserHistory

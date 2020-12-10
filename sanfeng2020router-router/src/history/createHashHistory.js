function createHashHistory() {
  // 操作和状态是通过push和go等操作函数进行修改
  let action
  let state
  // 历史记录栈 和 当前栈的指针位置 index
  let stack = []
  let index = -1
  let listeners = []

  function listen(listener) {
    listeners.push(listener)
    return function () {
      listeners = listeners.filter((item) => item !== listener)
    }
  }

  window.addEventListener('hashchange', () => {
    // 获取最新的pathname
    let pathname = window.location.hash.slice(1)
    // 将变更的信息合并到history对象上: action和state都是函数内变量维护着最新的值
    Object.assign(history, { action, location: { pathname, state } })
    // 维护历史栈
    if (action === 'PUSH') {
      stack[++index] = history.location
    }
    listeners.forEach((listener) => listener(history.location))
  })

  // 修改属性 并修改hash 值 然后出发hashchange的回调
  function push(pathname, nextState) {
    action = 'PUSH'
    if (typeof pathname === 'object') {
      pathname = pathname.pathname
      state = pathname.state
    } else {
      state = nextState
    }
    // 关键代码 修改hash值 触发事件监听函数 hashchange
    window.location.hash = pathname
  }

  // 以下三个函数要维护历史栈信息
  function go(n) {
    action = 'POP'
    index += n
    let nextLocation = stack[index]
    state = nextLocation.state
    window.location.hash = nextLocation.pathname // 触发hashchange
  }
  function goBack() {
    go(-1)
  }
  function goForward() {
    go(1)
  }
  let history = {
    action: 'POP',
    go,
    goBack,
    goForward,
    push,
    listen,
    location: { pathname: '/', state: undefined },
  }
  window.location.hash = window.location.hash
    ? window.location.hash.slice(1)
    : '/'

  window.myHistory = history
  return history
}

export default createHashHistory

// function createHashHistory() {
//   let stack = []
//   let index = -1
//   let action //最新的动作
//   let state //这是最新的状态
//   let listeners = []
//   function listen(listener) {
//     listeners.push(listener)
//     return function () {
//       //unlisten
//       listeners = listeners.filter((l) => l !== listener)
//     }
//   }
//   function go(n) {
//     action = 'POP'
//     index += n
//     let nextLocation = stack[index]
//     state = nextLocation.state
//     window.location.hash = nextLocation.pathname
//   }
//   function goBack() {
//     go(-1)
//   }
//   function goForward() {
//     go(1)
//   }
//   window.addEventListener('hashchange', () => {
//     let pathname = window.location.hash.slice(1)
//     Object.assign(history, { action, location: { pathname, state } })
//     if (action === 'PUSH') {
//       stack[++index] = history.location
//     }
//     listeners.forEach((listener) => listener(history.location))
//   })
//   function push(pathname, nextState) {
//     action = 'PUSH'
//     if (typeof pathname === 'object') {
//       state = pathname.state
//       pathname = pathname.pathname
//     } else {
//       state = nextState
//     }
//     window.location.hash = pathname
//   }
//   const history = {
//     action: 'POP', //默认是POP
//     go,
//     goBack,
//     goForward,
//     push,
//     listen,
//     location: { pathname: '/', state: undefined },
//   }
//   window.location.hash = window.location.hash
//     ? window.location.hash.slice(1)
//     : '/'
//   window.myHistory = history
//   return history
// }

// export default createHashHistory

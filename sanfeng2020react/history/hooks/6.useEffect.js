import React from 'react'
import ReactDOM from 'react-dom'

// let hookStates = []
// let hookIndex = 0

// function useState(initialState) {
//   hookStates[hookIndex] =
//     hookStates[hookIndex] ||
//     (typeof initialState === 'function' ? initialState() : initialState)

//   let currentIndex = hookIndex
//   function setState(newState) {
//     hookStates[currentIndex] =
//       typeof newState === 'function'
//         ? newState(hookStates[currentIndex])
//         : newState
//     render()
//   }
//   return [hookStates[hookIndex++], setState]
// }

// let hookStates = []
// let hookIndex = 0
// function useState(initialState) {
//   hookStates[hookIndex] = hookStates[hookIndex] || initialState
//   let currentIndex = hookIndex
//   function setState(newState) {
//     hookStates[currentIndex] =
//       typeof newState === 'function'
//         ? newState(hookStates[hookIndex])
//         : newState
//     render()
//   }
//   return [hookStates[hookIndex++], setState]
// }

let hookStates = []
let hookIndex = 0
function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState
  let currentIndex = hookIndex
  function setState(newState) {
    if (typeof newState === 'function') {
      newState = newState(hookStates[currentIndex])
    }
    hookStates[currentIndex] = newState
    render()
  }
  return [hookStates[hookIndex++], setState]
}

// 如何处理销毁函数
function useEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    // 比较依赖数组中的每一项,如果有变化就更新
    let { lastDeps, destroy } = hookStates[hookIndex]
    let isSame = deps.every((item, index) => item === lastDeps[index])
    if (isSame) {
      hookIndex++
    } else {
      if (destroy) destroy()
      // 有变化 将新的依赖数组中的所有值再复制给hookState[hookIndex]
      let state = { lastDeps: deps }
      // 初始化 保存依赖数组 并执行callback, 使用宏任务保证组件渲染完成之后再执行callback  => 副作用
      hookStates[hookIndex++] = state // 把依赖数组保存起来
      // setTimeout(callback)
      setTimeout(() => {
        let destroy = callback()
        state.destroy = destroy
      })
    }
  } else {
    let state = { lastDeps: deps }
    // 初始化 保存依赖数组 并执行callback, 使用宏任务保证组件渲染完成之后再执行callback  => 副作用
    hookStates[hookIndex++] = state // 把依赖数组保存起来
    // setTimeout(callback)
    setTimeout(() => {
      let destroy = callback()
      state.destroy = destroy
    })
  }
}

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let timer = setInterval(() => {
      setCount((count) => count + 1)
      document.title = `标题修改了${count}次`
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [count])
  return (
    <div>
      <p>定时器修改标题</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}

function render() {
  // 每次渲染都要清空索引
  hookIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
render()

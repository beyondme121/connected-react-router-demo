import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

// 全局存储state, useMemo, useCallback的数组 和 索引 也就是意味着 顺序不能改变, 使用了索引
let hookStates = []
let hookIndex = 0

function useState(initState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initState
  let currentIndex = hookIndex
  function setState(newState) {
    if (typeof newState === 'function') {
      newState = newState(hookStates[hookIndex])
    }
    hookStates[hookIndex] = newState
    // 重新刷新
    render()
  }
  return [hookStates[hookIndex++], setState]
}

// factory: 是个函数 函数执行返回一个对象
function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    let [lastMemo, lastDeps] = hookStates[hookIndex]
    // 比较依赖项中的状态 新老之间是否有变化, 当前使用useMemo的依赖项
    let same = deps.every((item, index) => item === lastDeps[index])
    if (same) {
      hookIndex++
      return lastMemo
    } else {
      // 有变化, 需要重新创建新的memo
      let newMemo = factory()
      hookStates[hookIndex++] = [newMemo, deps]
      return newMemo
    }
  } else {
    // 如果是初始化
    let newMemo = factory()
    // 存起来用于优化时比较
    hookStates[hookIndex++] = [newMemo, deps]
    return newMemo
  }
}

// 返回的依然是函数本身 只是如果依赖项变化了 就重新定义
function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDeps] = hookStates[hookIndex]
    let same = deps.every((item, index) => item === lastDeps[index])
    if (same) {
      hookIndex++
      return lastCallback
    } else {
      hookStates[hookIndex++] = [callback, deps]
      return callback
    }
  } else {
    hookStates[hookIndex++] = [callback, deps]
    return callback
  }
}

// 高阶组件 如果接受的props不发生变化，不重新渲染
function memo(OldComponent) {
  return class extends PureComponent {
    render() {
      return <OldComponent {...this.props} />
    }
  }
}

function useReducer(reducer, initialState, initFn) {
  hookStates[hookIndex] =
    hookStates[hookIndex] || (initFn ? initFn(initialState) : initialState)
  let currentIndex = hookIndex
  function dispatch(action) {
    // 如果没有reducer函数, 意味着action就是一个状态数据
    hookStates[currentIndex] = reducer
      ? reducer(hookStates[currentIndex], action)
      : action
  }
  // 返回状态 {name: 'xxx', role: [xxx,yyy]}
  return [hookStates[hookIndex++], dispatch]
}

let Child = memo(function Child({ salary }) {
  console.log('child render')
  return <div>{salary}</div>
})

function countReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        count: state.count + action.payload,
      }
    default:
      return state
  }
}

function App() {
  const [name, setName] = useState('hello')
  const [salary, setSalary] = useState(10000)
  const [state, dispatchCount] = React.useReducer(
    countReducer,
    { count: 10, age: 30 },
    (state) => ({ count: state.count + 10, age: state.age })
  )
  let raise10 = useMemo(() => {
    return salary * 1.1
  }, [salary])

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Child salary={raise10} />
      <button onClick={() => dispatchCount({ type: 'ADD', payload: 10 })}>
        + {state.count} + {state.age}
      </button>
    </div>
  )
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}
render()

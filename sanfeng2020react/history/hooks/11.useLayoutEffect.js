// 修改number的值, 将number的值赋值给ref.current, 最终使用的也是ref.current
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

let hookStates = []
let hookIndex = 0

function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState
  let currentIndex = hookIndex

  function setState(newState) {
    hookStates[hookIndex] =
      typeof newState === 'function'
        ? newState(hookStates[currentIndex])
        : newState
    render()
  }
  return [hookStates[hookIndex++], setState]
}

function useRef(current) {
  hookStates[hookIndex] = hookStates[hookIndex] || { current }
  return hookStates[hookIndex++]
}

function useLayoutEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    let { destroy, lastDeps } = hookStates[hookIndex]
    let same = deps.every((item, index) => item === lastDeps[index])
    if (same) {
      hookIndex++
    } else {
      if (destroy) {
        destroy()
      } else {
        let state = { lastDeps: deps }
        hookStates[hookIndex++] = state
        Promise.resolve().then(() => {
          let destroy = callback()
          state.destroy = destroy
        })
      }
    }
  } else {
    let state = { lastDeps: deps }
    hookStates[hookIndex++] = state
    queueMicrotask(() => {
      let destroy = callback()
      state.destroy = destroy
    })
  }
}

const Animation = () => {
  let [number, setNumber] = useState(0)
  let divRef = React.useRef()

  // 初次渲染divRef.current是undefined没毛病, 渲染之後ref={divRef} 之后divRef.current就是dom元素了
  // 通过useEffect(渲染那之后执行) 可以验证

  // 将回调函数的执行放在了宏任务中,在渲染之后执行, 所以有移动的效果
  // useEffect(() => {
  //   divRef.current.style.transform = 'translate(500px)'
  //   divRef.current.style.transition = 'all 500ms'
  // }, [])

  // 将回调函数的执行放在了微任务中,在渲染之前执行, 所以看不到移动的效果
  React.useLayoutEffect(() => {
    divRef.current.style.transform = 'translate(500px)'
    divRef.current.style.transition = 'all 500ms'
  }, [])

  let style = {
    width: '100px',
    height: '100px',
    backgroundColor: 'red',
  }

  let handleClick = () => {
    setNumber(number + 1)
  }
  return (
    <div style={style} ref={divRef}>
      <button onClick={handleClick}>+</button>
    </div>
  )
}

function render() {
  hookIndex = 0
  ReactDOM.render(<Animation />, document.getElementById('root'))
}
render()

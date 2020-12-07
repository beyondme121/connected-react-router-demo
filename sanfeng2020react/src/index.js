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

// let hookStates = []
// let hookIndex = 0
// function useState(initialState) {
//   hookStates[hookIndex] = hookStates[hookIndex] || initialState
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
// function useRef(current) {
//   hookStates[hookIndex] = hookStates[hookIndex] || { current }
//   return hookStates[hookIndex++]
// }

function App() {
  debugger
  let [number, setNumber] = useState(0)
  let numberRef = useRef(number)

  let delayAlertNumber = () => {
    setTimeout(() => {
      alert(numberRef.current)
    }, 3000)
  }
  // 1. 函数定义时
  let handleClick = () => {
    setNumber(number + 1)
  }

  useEffect(() => {
    // number已经是更新后的值了,再赋值给ref就可以通过current获取到最新的值了
    numberRef.current = number
  })

  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
      <button onClick={delayAlertNumber}>+</button>
    </div>
  )
}

function render() {
  hookIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
render()

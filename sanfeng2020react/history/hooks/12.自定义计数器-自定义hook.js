// 修改number的值, 将number的值赋值给ref.current, 最终使用的也是ref.current
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

// let hookStates = []
// let hookIndex = 0

// function useState(initialState) {
//   hookStates[hookIndex] = hookStates[hookIndex] || initialState
//   let currentIndex = hookIndex

//   function setState(newState) {
//     hookStates[hookIndex] =
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

// function useLayoutEffect(callback, deps) {
//   if (hookStates[hookIndex]) {
//     let { destroy, lastDeps } = hookStates[hookIndex]
//     let same = deps.every((item, index) => item === lastDeps[index])
//     if (same) {
//       hookIndex++
//     } else {
//       if (destroy) {
//         destroy()
//       } else {
//         let state = { lastDeps: deps }
//         hookStates[hookIndex++] = state
//         Promise.resolve().then(() => {
//           let destroy = callback()
//           state.destroy = destroy
//         })
//       }
//     }
//   } else {
//     let state = { lastDeps: deps }
//     hookStates[hookIndex++] = state
//     queueMicrotask(() => {
//       let destroy = callback()
//       state.destroy = destroy
//     })
//   }
// }

// 自定义hook
function useNumber(init, payload) {
  let [number, setNumber] = useState(init)
  // 相同的逻辑: 定时器加payload
  useEffect(() => {
    let timer = setInterval(() => {
      setNumber((_) => _ + payload)
    }, 2000)
    return () => {
      console.log('clearInterval')
      clearInterval(timer)
    }
  }, [])
  return [number, () => setNumber((x) => x + payload)]
}

//
function TimerTen() {
  let [number, addTen] = useNumber(1, 10)
  return (
    <div>
      <p>{number}</p>
      <button onClick={addTen}>+1</button>
    </div>
  )
}

function Timer100() {
  let [number, add100] = useNumber(1, 100)
  return (
    <div>
      <p>{number}</p>
      <button onClick={add100}>+100</button>
    </div>
  )
}

function App() {
  return (
    <div>
      <TimerTen />
      <Timer100 />
    </div>
  )
}

function render() {
  // hookIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
render()

// function useNumber(init) {
//   let [number, setNumber] = useState(init)
//   useEffect(() => {
//     setInterval(() => {
//       setNumber((number) => number + 1)
//     }, 3000)
//   }, [])
//   return [number, () => setNumber((x) => x + 1)]
// }
// function Timer1() {
//   let [number, add] = useNumber(1)
//   return (
//     <div>
//       <p>{number}</p>
//       <button onClick={add}>+</button>
//     </div>
//   )
// }
// function Timer2() {
//   let [number, add] = useNumber(10)
//   return (
//     <div>
//       <p>{number}</p>
//       <button onClick={add}>+</button>
//     </div>
//   )
// }

// function render() {
//   ReactDOM.render(
//     <div>
//       <Timer1 />
//       <Timer2 />
//     </div>,
//     document.getElementById('root')
//   )
// }
// render()

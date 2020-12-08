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

// let ChildWithRef = React.forwardRef(Child)

// function Child(props, ref) {
//   return (
//     <div>
//       <input type="text" ref={ref} />
//     </div>
//   )
// }

// function Parent() {
//   // 父組件可以拿到子組件中的ref
//   let inputRef = useRef()

//   let handleClick = () => {
//     inputRef.current.focus()
//   }
//   return (
//     <div>
//       <p>把ref传递给子组件,把ref赋值给子组件中的元素</p>
//       <ChildWithRef ref={inputRef} />
//       <button onClick={handleClick}>handleClick</button>
//     </div>
//   )
// }

function Child(props, ref) {
  let inputRef = React.useRef()
  // 对父组件传递到子组件中的ref进行重新定义,执行回调并返回一个对象, 只包含了focus方法
  // 父组件只能调用focus方法，避免父组件意外操作 比如删除子节点
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    },
  }))
  return <input type="text" ref={inputRef} />
}

Child = React.forwardRef(Child)

function Parent() {
  let childRef = useRef()
  let handleClick = () => {
    // childRef.current.focus()
    console.log(childRef.current)
  }
  return (
    <div>
      <Child ref={childRef} />
      <button onClick={handleClick}>handleClick</button>
    </div>
  )
}

function render() {
  hookIndex = 0
  ReactDOM.render(<Parent />, document.getElementById('root'))
}
render()

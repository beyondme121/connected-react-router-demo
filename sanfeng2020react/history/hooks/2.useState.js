import React from 'react'
import ReactDOM from 'react-dom'
/**
 * 1. 基本的useState
 * 2. 延迟修改状态: 延迟3s 修改状态 多次点击修改的方法, 如果是传入的状态数据, 由于闭包作用, number值总是当时的0 没有改变多次点击还是1
 * 3. 函数式更新 如果传入的是函数, 内部实现是把老的状态传递给setState,执行这个函数,得到新的状态 并 返回
 */
let lastState
function useState(initState) {
  lastState = lastState || initState

  function setState(newState) {
    if (typeof newState === 'function') {
      newState = newState(lastState)
    }
    lastState = newState
    // 重新刷新
    render()
  }
  return [lastState, setState]
}

let lastRef
function useRef() {
  lastRef = lastRef || { current: null }
  return lastRef
}

function Counter(props) {
  const [number, setNumber] = useState(0)
  const numberRef = useRef()

  let addClick = () => {
    setNumber(number + 1)
    numberRef.current = number + 1
  }

  // 多次点击，依赖上一次的值改变 而不是闭包
  let addFnClick = () => {
    setTimeout(() => {
      setNumber((num) => num + 100)
    }, 1000)
  }

  let handleClick = () => {
    setTimeout(() => {
      alert(number)
    }, 1000)
  }

  // 先点击,然后点击addClick
  let refClick = () => {
    setTimeout(() => {
      alert(numberRef.current)
    }, 1000)
  }
  return (
    <div>
      <button onClick={addClick}>{number}</button>
      <button onClick={addFnClick}>{number}</button>
      <button onClick={handleClick}>闭包打印当时的number</button>
      <button onClick={refClick}>使用useRef保存修改后的值</button>
    </div>
  )
}

function render() {
  ReactDOM.render(<Counter />, document.getElementById('root'))
}
render()

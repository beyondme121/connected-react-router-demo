import React from 'react'
import ReactDOM from 'react-dom'

let lastState
function useState(initState) {
  lastState = lastState || initState

  function setState(newState) {
    // 改变状态
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
      <button onClick={handleClick}>闭包打印当时的number</button>
      <button onClick={refClick}>使用useRef保存修改后的值</button>
    </div>
  )
}

function render() {
  ReactDOM.render(<Counter />, document.getElementById('root'))
}
render()

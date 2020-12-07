// 修改number的值, 将number的值赋值给ref.current, 最终使用的也是ref.current
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

function App() {
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
    console.log('number: ', number) // 还未更新
    numberRef.current = number + 1
  }

  return (
    <div>
      <p>{numberRef.current}</p>
      <button onClick={handleClick}>+</button>
      <button onClick={delayAlertNumber}>+</button>
    </div>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))

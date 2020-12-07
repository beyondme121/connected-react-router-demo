import React, { useState } from 'react'
import ReactDOM from 'react-dom'
const LoadingContext = React.createContext()
const ChangeColorContext = React.createContext()

function useContext(context) {
  return context._currentValue
}

// useContext 获取该组件父级附件中的值, 这个value可以传递数据, 状态, userReducer的返回值 => state, dispatch
function App() {
  const [color, setColor] = useState('red')
  let changeColor = (_color) => setColor(_color)

  return (
    <div>
      <button onClick={() => changeColor('blue')}>changeBlue</button>
      <button onClick={() => changeColor('yellow')}>changeYellow</button>
      <LoadingContext.Provider value={{ isLoading: true, delay: 3000 }}>
        <ChangeColorContext.Provider value={{ color: color }}>
          <ProductList />
        </ChangeColorContext.Provider>
      </LoadingContext.Provider>
    </div>
  )
}

function ProductList(props) {
  let loadingValue = useContext(LoadingContext)
  return (
    <div>
      <p>
        {loadingValue.isLoading.toString()}, {loadingValue.delay}
      </p>
      <ProductTable />
    </div>
  )
}

function ProductTable() {
  let colorValue = useContext(ChangeColorContext)
  return <div>{colorValue.color}</div>
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}
render()

import React, { useRef, useMemo, useCallback, memo } from 'react'
import ReactDOM from 'react-dom'

let root = document.getElementById('root')

function Counter(props) {
  const [count, setCount] = React.useState(0)
  const countRef = useRef() // {current: null}

  function handleAlert() {
    setTimeout(() => {
      alert(countRef.current)
    }, 1500)
  }

  return (
    <div>
      <button
        onClick={() => {
          setCount((count) => count + 1)
          console.log('count: ', count) //
          countRef.current = count + 1 // 修改后, 批量更新
        }}
      >
        +
      </button>
      <button onClick={handleAlert}>延迟打印</button>
      <p>{count}</p>
    </div>
  )
}

function Counter2() {
  const [number, setNumber] = React.useState(0)
  let numberRef = useRef(number)
  numberRef.current = number
  function alertNumber() {
    setTimeout(() => {
      alert(numberRef.current)
    }, 1000)
  }
  function lazy() {
    setTimeout(() => {
      setNumber(number + 1)
    }, 2000)
  }
  function lazyFunc() {
    setTimeout(() => {
      setNumber((number) => number + 1)
    }, 3000)
  }
  return (
    <>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
      <button onClick={lazy}>lazy+</button>
      <button onClick={lazyFunc}>lazyFunc+</button>
      <button onClick={alertNumber}>alertNumber</button>
    </>
  )
}

function LazyCounter() {
  const [{ name, count }, setValue] = React.useState(() => {
    return {
      name: 'sf',
      count: 100,
    }
  })

  return (
    <div>
      <p>
        {name} : {count}
      </p>
      <button onClick={() => setValue({ name: 'sanfeng', count: count + 1 })}>
        修改信息
      </button>
    </div>
  )
}

function Parent() {
  const [name, setName] = useState('sanfeng')
  const [number, setNumber] = useState(0)

  // name变化不影响Child,child不应该渲染 緩存 子组件中用到的数据
  let data = useMemo(() => {
    return {
      number,
    }
  }, [number])

  // 看看子组件还接收了什么信息 => 方法 每次都是新的!!! () => setNumber(number + 1)
  // let handleClick = useCallback(() => {
  //   return () => setNumber(number + 1)
  // }, [number])

  // let handleClick = useCallback(() => setNumber(number + 1), [number])
  // let handleClick = useCallback(() => {
  //   setNumber(number + 1)
  // }, [number])

  // 没有优化 缓存
  // let handleClick = () => setNumber((_) => _ + 100)

  let handleClickUseCallback = useCallback(() => setNumber((_) => _ + 1), [])

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Child data={data} handleClick={handleClickUseCallback} />
    </div>
  )
}

let Child = memo(function Child(props) {
  console.log('child')
  return (
    <div>
      <button onClick={props.handleClick}>{props.data.number}</button>
    </div>
  )
})

let lastState
function useState(initState) {
  lastState = lastState || initState
  function setState(newState) {
    lastState = newState
    render()
  }
  return [lastState, setState]
}

function render() {
  ReactDOM.render(<Parent />, document.getElementById('root'))
}

render()

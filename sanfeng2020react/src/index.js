// // 修改number的值, 将number的值赋值给ref.current, 最终使用的也是ref.current
// import React, { useEffect, useState } from 'react'
// import ReactDOM from 'react-dom'
// const PAGE_SIZE = 5
// // 封裝数据请求的hook, 分页加载数据
// function useRequest(url) {
//   let [start, setStart] = useState(0) // 起始位置
//   let [users, setUsers] = useState([])
//   async function loadMore(url) {
//     let res = await fetch(
//       `${url}?start=${start}&pageSize=${PAGE_SIZE}`
//     ).then((response) => response.json())
//     setUsers([users, ...res])
//     setStart(start + PAGE_SIZE)
//   }
//   // useEffect(loadMore, [start, users])
//   return [users, loadMore]
// }

// // // function useRequest(url) {
// // //   let [start, setStart] = useState(0)
// // //   let [users, setUsers] = useState([])
// // //   async function loadMore() {
// // //     setUsers(null) //异步的
// // //     console.log('loadMore.users=', users)
// // //     let pageData = await fetch(
// // //       `${url}?start=${start}&pageSize=${PAGE_SIZE}`
// // //     ).then((res) => {
// // //       return res.json()
// // //     })
// // //     console.log('pageData.users', users)
// // //     setUsers([...users, ...pageData])
// // //     setStart(start + PAGE_SIZE)
// // //   }
// // //   //useEffect(loadMore,[]);
// // //   return [users, loadMore]
// // // }

// function App() {
//   let [users, loadUsers] = useRequest('http://localhost:8080/api/users')
//   if (!users) {
//     return <div>loading...</div>
//   }
//   return (
//     <div>
//       <ul>
//         {users.map((item) => (
//           <li key={item.id}>{item.name}</li>
//         ))}
//       </ul>
//       <button onClick={loadUsers}>loadUsers</button>
//     </div>
//   )
// }

// function render() {
//   ReactDOM.render(<App />, document.getElementById('root'))
// }
// render()

import React, { useState, useEffect, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'
function useRequest(url) {
  let limit = 5
  let [offset, setOffset] = useState(0)
  let [data, setData] = useState([])
  function loadMore() {
    // setData(null)
    fetch(`${url}?start=${offset}&pageSize=${limit}`)
      .then((response) => response.json())
      .then((pageData) => {
        setData([...data, ...pageData])
        setOffset(offset + pageData.length)
      })
  }
  useEffect(loadMore, [])
  return [data, loadMore]
}

function App() {
  const [users, loadMore] = useRequest('http://localhost:8080/api/users')
  let baseURL = 'http://localhost:8080/api/users'
  let url = `${baseURL}?start=10&pageSize=10`
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }, [])
  if (users === null) {
    return <div>正在加载中....</div>
  }
  return (
    <>
      <ul>
        {users.map((item, index) => (
          <li key={index}>
            {item.id}:{item.name}
          </li>
        ))}
      </ul>
      <button onClick={loadMore}>加载更多</button>
    </>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))

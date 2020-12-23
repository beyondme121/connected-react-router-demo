import React from 'react'

function Home(props) {
  return (
    <div>
      Home
      <button onClick={() => props.history.go(-1)}>返回</button>
    </div>
  )
}

export default Home

import React from 'react'

export default function Home(props) {
  return (
    <div>
      Home
      <button onClick={() => props.history.push({
        pathname: '/user',
        state: { username: 'sanfeng' }
      })}>user</button>
    </div>
  )
}

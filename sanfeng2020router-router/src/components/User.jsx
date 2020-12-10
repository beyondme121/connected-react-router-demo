import React from 'react'

export default function User(props) {
  return (
    <div>
      <p>User</p>
      <strong>{props.location.state && props.location.state.username}</strong>
      <button onClick={() => props.history.push('/product')}>product</button>
    </div>
  )
}

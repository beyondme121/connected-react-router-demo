import React from 'react'

export default function Login(props) {
  let login = () => {
    localStorage.setItem('login', 'true')
    let to = '/'
    if (props.history.location.state) {
      to = props.location.state.from
    }
    props.history.push(to)
  }
  return (
    <div>
      Login
      <button onClick={login}>login</button>
    </div>
  )
}

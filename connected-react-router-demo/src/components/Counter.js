import React from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions/counter'
function Counter(props) {
  return (
    <div>
      <p>Counter</p>
      <div>number: {props.number}</div>
      <button onClick={props.add}> + </button>
      <button onClick={props.minus}> - </button>
      <button onClick={() => props.go('/home')}>home</button>
    </div>
  )
}

export default connect((state) => state.counter, actions)(Counter)

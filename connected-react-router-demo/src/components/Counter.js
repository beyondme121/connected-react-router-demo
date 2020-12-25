import React from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions'
function Counter(props) {
  let { number, add } = props
  console.log("number, ", number, add)
  return (
    <div>
      <p>Counter</p>
      <p>{number}</p>
      <button onClick={add}>+</button>
      <button onClick={add}>+</button>
    </div>
  )
}
export default connect(
  state => state,
  actions
)(Counter)

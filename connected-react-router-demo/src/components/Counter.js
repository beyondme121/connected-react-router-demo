import React from 'react'
import { connect } from 'react-redux'
function Counter(props) {
  return (
    <div>
      <p>Counter</p>
      number: {props.number}
    </div>
  )
}

export default connect((state) => state.counter)(Counter)

import React from './react'
import ReactDOM from './react-dom'
// import { updateQueue } from './Component'
let root = document.getElementById('root')

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
  }

  handleClick = (event) => {
    // console.log('handleClick', event) // 不是原生的event
    // updateQueue.isBatchingUpdate = true
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
    })
    // updateQueue.batchUpdate()
  }
  handleDiv = () => {
    console.log('handleDiv')
  }

  render() {
    return (
      <div onClick={this.handleDiv}>
        <span>{this.state.number}</span>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<Counter />, root)

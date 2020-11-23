import React from 'react'
import ReactDOM from 'react-dom'
let root = document.getElementById('root')

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
  }

  handleClick = () => {
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
  }

  render() {
    return (
      <div>
        <span>{this.state.number}</span>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<Counter />, root)

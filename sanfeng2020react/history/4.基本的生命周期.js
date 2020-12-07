import React from './react'
import ReactDOM from './react-dom'
let root = document.getElementById('root')

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
    console.log('Counter 1.set up props and state')
  }
  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 })
    console.log('number: ', this.state.number)
  }

  componentWillMount() {
    console.log('Counter 2.componentWillMount')
  }

  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }

  componentDidMount() {
    console.log('Counter 4.componentDidMount')
  }

  shouldComponentUpdate() {
    console.log('Counter 5.shouldComponentUpdate')
    return false
  }
  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate')
  }
}

ReactDOM.render(<Counter />, root)

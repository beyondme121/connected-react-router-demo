import React from './react'
import ReactDOM from './react-dom'
let root = document.getElementById('root')

let element = React.createElement(
  'h1',
  {
    className: 'title',
    style: {
      color: 'red',
    },
  },
  React.createElement('span', null, 'hello'),
  'world11'
)
// console.log('element', JSON.stringify(element, null, 2))

function Welcome(props) {
  return <p>{props.name}</p>
}
let ele = <Welcome name="sanfeng" />

class ClassComponent extends React.Component {
  render() {
    return <h2>年龄: {this.props.age}</h2>
  }
}
let class_ele = <ClassComponent age={100} />

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { counter: 0 }
  }
  handleClick = () => {
    this.setState({ counter: this.state.counter + 1 })
  }
  render() {
    return (
      <div>
        <p>counter: {this.state.counter}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

// ReactDOM.render(ele, root)
// ReactDOM.render(class_ele, root)
ReactDOM.render(<Counter />, root)

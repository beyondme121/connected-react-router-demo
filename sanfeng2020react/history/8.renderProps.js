import React from 'react'
import ReactDOM from 'react-dom'
let root = document.getElementById('root')

// renderProps 两种写法 <组件 render={函数}/>  <组件>{props => { return (元素)}}</组件>

// 封装的组件 抽象出来的组件
class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0,
  }

  handleMouseMove = (e) => {
    this.setState({
      x: e.clientX,
      y: e.clientY,
    })
  }
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

// 想让所有的组件都具有mouseTracker的功能

ReactDOM.render(
  <MouseTracker
    render={(props) => (
      <div>
        {props.x}, {props.y}
      </div>
    )}
  />,
  root
)

import React from 'react'
import ReactDOM from 'react-dom'
let root = document.getElementById('root')
class Counter extends React.Component {
  static defaultProps = {
    //默认属性
    name: 'zhufeng',
  }
  constructor(props) {
    super(props)
    this.state = { number: 0 }
    console.log('父组件 1.set up props and state')
  }

  static getDerivedStateFromProps(newProps, prevState) {
    console.log('newProps, prevState', newProps, prevState)
    return null
  }

  // componentWillMount() {
  //   console.log('父组件 2.componentWillMount')
  // }
  render() {
    console.log('父组件 3.render')
    return (
      <div id={`counter${this.state.number}`}>
        <p>{this.state.number}</p>
        {/* {this.state.number === 4 ? null : (
          <ChildCounter count={this.state.number} />
        )} */}
        <ChildCounter count={3} />
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
  componentDidMount() {
    console.log('父组件 4.componentDidMount')
  }
  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 })
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('父组件 5.shouldComponentUpdate')
  //   return nextState.number % 2 === 0 //如果是偶数就true更新 奇数不更新
  // }
  // componentWillUpdate() {
  //   console.log('父组件 6.componentWillUpdate')
  // }
  componentDidUpdate() {
    console.log('父组件 7.componentDidUpdate')
  }
}
class ChildCounter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0,
    }
    console.log('子组件 1.constructor')
  }
  static getDerivedStateFromProps(newProps, prevState) {
    let { count } = newProps
    console.log('getDerivedStateFromProps: ', count, prevState)
    if (count % 2 === 0) {
      return {
        number: count * 2,
      }
    } else {
      return {
        number: count * 3,
      }
    }
  }

  // componentWillMount() {
  //   console.log('子组件 1.componentWillMount')
  // }
  render() {
    console.log('子组件 2.render')
    return (
      <div id={`child-counter-${this.state.number}`}>{this.state.number}</div>
    )
  }
  componentDidMount() {
    console.log('子组件 3.componentDidMount')
  }
  // componentWillUpdate() {
  //   console.log('子组件 4.componentWillUpdate')
  // }
  componentDidUpdate() {
    console.log('子组件 5.componentDidUpdate')
  }
  // componentWillReceiveProps() {
  //   console.log('子组件 6.componentWillReceiveProps')
  // }
  componentWillUnmount() {
    console.log('子组件 7.componentWillUnmount')
  }
}

ReactDOM.render(<Counter />, root)
/**
 * element vdom = {type:Counter}
 * let counterInstance = new Counter();
 * let renderVdom = counterInstance.render();//{type:'div',props:{id:'counter'}}
 * renderVdom的二儿子挂载的时候
 * secondVdom = {type:ChildCounter};
 * let childCounterRenderVdom = new ChildCounter();
 * childCounterRenderVdom.dom = <div id="child-counter"><p></p></div>
 */

/**
父组件 1.set up props and state
父组件 2.componentWillMount
父组件 3.render
父组件 4.componentDidMount
2 父组件 5.shouldComponentUpdate
父组件 6.componentWillUpdate
父组件 3.render
父组件 7.componentDidUpdate
2 父组件 5.shouldComponentUpdate
父组件 6.componentWillUpdate
父组件 3.render
父组件 7.componentDidUpdate
 */

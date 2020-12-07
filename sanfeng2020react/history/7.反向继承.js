import React from 'react'
import ReactDOM from 'react-dom'
let root = document.getElementById('root')
// 反向继承: 扩展别人的组件 增加屬性和方法, 继承的关系, 不是嵌套的关系

class Button extends React.Component {
  state = { name: '张三' }
  componentDidMount() {
    console.log('Button componentDidMount')
  }
  render() {
    console.log('Button render')
    return <button name={this.state.name} title={this.props.title} />
  }
}

const wrapper = (OldComponent) => {
  return class NewComponent extends OldComponent {
    state = {
      number: 0,
    }
    componentDidMount() {
      console.log('NewComponent componentDidMount')
      super.componentDidMount()
    }
    handleClick = (event) => {
      this.setState({ number: this.state.number + 1 })
    }

    render() {
      let oldRenderVdom = super.render()
      let newProps = {
        ...oldRenderVdom.props,
        onClick: this.handleClick,
      }
      console.log(oldRenderVdom)
      console.log('newProps:', newProps)
      return React.cloneElement(oldRenderVdom, newProps, this.state.number) // ！！！！！！！！！！！！！！！！！！！！！
    }
  }
}
let NewButton = wrapper(Button)

ReactDOM.render(<NewButton />, root)

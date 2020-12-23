import React from 'react'

class Lifecycle extends React.Component {
  componentDidMount() {
    if (this.props.onMount) {
      // 调用并把组件实例传递过去 让调用处使用 比如将一些属性挂载到实例上
      // onMount是个函数
      this.props.onMount(this)
    }
  }
  componentWillUnmount() {
    if (this.props.onUnMount) {
      this.props.onUnMount(this)
    }
  }
  render() {
    return null
  }
}

export default Lifecycle

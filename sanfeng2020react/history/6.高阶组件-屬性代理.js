import React from 'react'
import ReactDOM from 'react-dom'
let root = document.getElementById('root')

// 实现显示隐藏功能
class Hello extends React.Component {
  handleShow = () => {
    let loading = document.getElementById('loading')
    if (!loading) {
      let div = document.createElement('div')
      div.innerHTML = `<p id='loading' style="position:absolute;top:100px;left:50%;width:100px;z-index:10;background-color:gray;color:red">加载中</p>`
      document.body.appendChild(div)
    } else {
      loading.style.display = 'block'
    }
  }

  handleHidden = () => {
    let loading = document.getElementById('loading')
    if (loading) {
      loading.style.display = 'none'
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleShow}>显示</button>
        <button onClick={this.handleHidden}>隐藏</button>
      </div>
    )
  }
}

class Page extends React.Component {
  onShow = () => {
    let loading = document.getElementById('loading')
    if (loading) {
      loading.style.display = 'block'
    } else {
      let div = document.createElement('div')
      div.innerHTML = `<p id="loading" style="background-color: 'red'">world</p>`
      document.body.appendChild(div)
    }
  }
  onHide = () => {
    let loading = document.getElementById('loading')
    if (loading) loading.style.display = 'none'
  }
  render() {
    return (
      <div>
        <button onClick={this.onShow}>show</button>
        <button onClick={this.onHide}>hide</button>
      </div>
    )
  }
}

// 高阶组件, 封装了loading效果的功能(高阶组件的自身的状态，接受的props和高阶组件自身的方法)
const loading = (message) => (OldComponent) => {
  return class extends React.Component {
    onShow = () => {
      let loading = document.getElementById('loading')
      if (loading) {
        loading.style.display = 'block'
      } else {
        let div = document.createElement('div')
        div.innerHTML = `<p id="loading" style="background-color: 'red'">${message}</p>`
        document.body.appendChild(div)
      }
    }

    onHide = () => {
      let loading = document.getElementById('loading')
      if (loading) {
        loading.style.display = 'none'
      }
    }

    render() {
      let obj = {
        onShow: this.onShow,
        onHide: this.onHide,
      }
      return <OldComponent {...this.props} {...obj} />
    }
  }
}

class Wrapper extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.onShow}>显示</button>
        <button onClick={this.props.onHide}>隐藏</button>
      </div>
    )
  }
}

let Demo = loading('你好')(Wrapper)

ReactDOM.render(<Demo />, root)

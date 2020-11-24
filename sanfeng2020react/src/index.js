import React from './react'
import ReactDOM from './react-dom'
let root = document.getElementById('root')
/**
 * 如果我们想在React获取到真实DOM元素的话
 * 1. ref 如果给input增加ref属性,值是一个字符串 this.refs.a=此input转成真实DOM之后真实DOM元素 废弃
 * 2.
 */
class Sum extends React.Component {
  constructor(props) {
    super(props)
    this.a = React.createRef() //{current:null}
    this.b = React.createRef() //{current:null}
    this.result = React.createRef() //{current:null}
  }
  add = (event) => {
    let aValue = this.a.current.value
    let bValue = this.b.current.value
    this.result.current.value = parseFloat(aValue) + parseFloat(bValue)
  }
  render() {
    return (
      <div>
        <input ref={this.a} />+<input ref={this.b} />
        <button onClick={this.add}>=</button>
        <input ref={this.result} />
      </div>
    )
  }
}
ReactDOM.render(<Sum />, root)

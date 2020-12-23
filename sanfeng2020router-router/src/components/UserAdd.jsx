
// import React, { useState, useRef, useEffect } from 'react'
// import { Prompt } from '../react-router-dom'
// export default function UserAdd(props) {
//   let [isBlocking, setIsBlocking] = useState(false)
//   let usernameRef = useRef()

//   let handleSubmit = (e) => {
//     e.preventDefault()
//     // 提交数据不需要阻止
//     setIsBlocking(false)
//     // setTimeout(() => {
//     //   let username = usernameRef.current.value
//     //   console.log("username", username)
//     //   props.history.push('/')
//     // })
//   }

//   let handleInput = e => {
//     setIsBlocking(e.target.value.length > 0)
//   }

//   useEffect(() => {

//   }, [isBlocking])


//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <Prompt
//           when={isBlocking}
//           message={location => `确定要跳转到${location.pathname}吗?`}
//         />
//         <input type="text" ref={usernameRef} onChange={handleInput} />
//         <button type="submit">submit</button>
//       </form>
//     </div>
//   )
// }


// 类组件实现
import React from 'react';
import { Prompt } from '../react-router-dom';
//class className for htmlFor
//在antDesign里面 type指的是类型 primary success warning default 
// <Button type="primary" htmlType="submit">按钮</Button>
export default class UserAdd extends React.Component {
  usernameRef = React.createRef()
  state = { isBlocking: false } //是否阻止或者说是否拦截 默认值是false
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      isBlocking: false
    }, () => {
      console.log("this.state.isBlocking:", this.state.isBlocking)
      let username = this.usernameRef.current.value;
      console.log(username);
      this.props.history.push('/');
    });
  }
  render() {
    console.log("render isBlocking", this.state.isBlocking)
    //when当为true的时候，就要拦截，为false的时候就不拦截
    //如果要拦截的时候，会弹出一个提示框，提示框的文本
    return (
      <form onSubmit={this.handleSubmit}>
        <Prompt
          when={this.state.isBlocking}
          message={
            (location) => `请问你确定要跳转到${location.pathname}吗?`
          }
        />
        <input ref={this.usernameRef} onChange={
          event => this.setState({ isBlocking: event.target.value.length > 0 })
        } />
        <button type="submit">提交</button>
      </form>
    )
  }
}


// 正确实现功能版本
// import React, { useState, useRef } from 'react'
// import { Prompt } from '../react-router-dom'
// export default function UserAdd(props) {
//   let [isBlocking, setIsBlocking] = useState(false)
//   let usernameRef = useRef()

//   let handleSubmit = (e) => {
//     e.preventDefault()
//     // 提交数据不需要阻止
//     // stateRef.current = false
//     // let username = usernameRef.current.value
//     // console.log("username", username, " stateRef.current: ", stateRef.current)
//     // props.history.push('/')
//     setIsBlocking(false)
//     setTimeout(() => {
//       let username = usernameRef.current.value
//       console.log("username", username)
//       props.history.push('/')
//     })
//   }

//   let handleInput = e => {
//     setIsBlocking(e.target.value.length > 0)
//   }


//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <Prompt
//           when={isBlocking}
//           message={location => `确定要跳转到${location.pathname}吗?`}
//         />
//         <input type="text" ref={usernameRef} onChange={handleInput} />
//         <button type="submit">submit</button>
//       </form>
//     </div>
//   )
// }

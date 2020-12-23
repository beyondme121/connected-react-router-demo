import React from 'react'
import { withRouter } from '../react-router'

function NavHeader(props) {
  console.log("props", props)
  return (
    <div>
      <strong>{props.title}</strong>
      <p onClick={() => props.history.push('/user')}>欢迎访问网站 点击跳转到用户管理页面</p>
    </div>
  )
}

export default withRouter(NavHeader)

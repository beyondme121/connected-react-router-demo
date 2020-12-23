import React from 'react'
import RouterContext from './RouterContext'
import Lifecycle from './Lifecycle'
function Prompt(props) {
  let { when, message: messageCallback } = props
  return (
    <RouterContext.Consumer>
      {(context) => {
        // when为false, 不需要提示确认, Prompt组件什么也不做
        if (!when) return null
        let block = context.history.block // history对象中的block方法 接收prompt函数
        // 当需要提示时Prompt, 涉及到组件挂载(渲染后等待用户确认) 和 组件销毁(点击确认离开 离开组件)
        // 需要生命周期 本组件是函数组件
        // 1. 可以使用一个空的只包含生命周期的组件 该组件接收props 然后在组件中判断并调用
        return (
          <Lifecycle
            onMount={(_instance) => {
              _instance.release = block(messageCallback)
            }}
            onUnMount={(self) => self.release()}
          />
        )
      }}
    </RouterContext.Consumer>
  )
}
export default Prompt

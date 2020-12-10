import React from 'react'
import { __RouterContext as RouterContext } from '../react-router'

// 实际就是a标签
export default function Link(props) {
  return (
    <RouterContext.Consumer>
      {(context) => {
        return (
          <a
            {...props}
            onClick={(e) => {
              e.preventDefault()
              context.history.push(props.to)
            }}
          >
            {props.children}
          </a>
        )
      }}
    </RouterContext.Consumer>
  )
}

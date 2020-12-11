import React, { useContext } from 'react'
import RouterContext from './RouterContext'

export default function Redirect({ to }) {
  let context = useContext(RouterContext)
  React.useEffect(() => {
    context.history.push(to)
  })
  return null
}

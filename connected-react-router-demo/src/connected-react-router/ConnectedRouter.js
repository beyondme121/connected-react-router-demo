import React from 'react'
import { Router } from 'react-router'
import { ReactReduxContext } from 'react-redux'
import { updateLocation } from './actions'  // 封装了一个改变地址保存到store的actionCreator
class ConnectedRouter extends React.Component {
  static contextType = ReactReduxContext
 
  constructor (props) {
    super(props)
    let { history } = props
    this.unlisten = history.listen((location) => { //  新版本的入参是location信息
      console.log("location", location)
      this.context.store.dispatch(updateLocation({
        location: history.location,
        action: history.action
      }))
    })
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render () {
    let { history , children } = this.props
    return <Router history={history}>
      {children}
    </Router>
  }
}

export default ConnectedRouter;
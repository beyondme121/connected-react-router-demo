import React from 'react'
import { createBrowserHistory } from '../history'
import { Router } from '../react-router'

class BrowserRouter extends React.Component {
  history = createBrowserHistory()
  render() {
    return <Router history={this.history}>{this.props.children}</Router>
  }
}
export default BrowserRouter

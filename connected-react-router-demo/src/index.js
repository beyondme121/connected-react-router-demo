import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './configureStore'

import Home from './components/Home'
import Counter from './components/Counter'

const store = configureStore(/* provide initial state if any */)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Link to="/">HOME</Link>
      <Link to="/counter">counter</Link>
      <Route path="/" component={Home} exact />
      <Route path="/counter" component={Counter} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

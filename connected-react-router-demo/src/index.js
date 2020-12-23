import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Home from './components/Home'
import Counter from './components/Counter'
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Link to="/">HOME</Link>
      <Link to="/counter">counter</Link>
      <Route path="/" component={Home} exact />
      <Route path="/counter" component={Counter} />
    </Router>
  </Provider>,
  document.getElementById('root')
)

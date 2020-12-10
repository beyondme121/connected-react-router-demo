import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Link } from './react-router-dom'
import Home from './components/Home'
import User from './components/User'
import Product from './components/Product'

function RouterApp() {
  return (
    <Router>
      {/* <ul>
        {['home', 'user', 'product'].map((item, index) => (
          <Link to={`/${item}`} key={index}>
            {item}
          </Link>
        ))}
      </ul> */}
      <ul>
        <li>
          <Link to="/user">用户</Link>
        </li>
      </ul>
      <Route path="/" component={Home} exact />
      <Route path="/user" component={User} />
      <Route path="/product" component={Product} />
      {/* 没有匹配上 会重定向到 Home组件 因为url中必然会是以 / 开头 */}
      {/* <Redirect from="/" to={Home} /> */}
      {/* 如果url为 /users 以上都匹配不上 就会Home */}
      {/* <Redirect from="/home" to={Home} /> */}
    </Router>
  )
}

ReactDOM.render(<RouterApp />, document.getElementById('root'))

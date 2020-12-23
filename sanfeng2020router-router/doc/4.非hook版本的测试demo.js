import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Switch,
} from './react-router-dom'
import Home from './components/Home'
import User from './components/User'
import Product from './components/Product'
import Protected from './components/Protected'
import Login from './components/Login'
import NavHeader from './components/NavHeader'
import UserAdd from './components/UserAdd'

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

      {/* <ul>
        <li>
          <Link to="/user">用户</Link>
        </li>
      </ul> */}
      <NavHeader title="这是标题" />
      <ul>
        <NavLink to="/">home</NavLink>
        <NavLink to="/user">user</NavLink>
        <NavLink to="/product">product</NavLink>
        <NavLink to="/useradd">useradd</NavLink>
      </ul>
      <Switch>
        <Route path="/" component={Home} exact />
        {/* <Route path="/user" component={User} /> */}
        <Protected path="/user" component={User} />
        <Route path="/login" component={Login} />
        <Route path="/product" component={Product} />
        <Route path="/useradd" component={UserAdd} />
      </Switch>

      {/* 没有匹配上 会重定向到 Home组件 因为url中必然会是以 / 开头 */}
      {/* <Redirect from="/" to={Home} /> */}
      {/* 如果url为 /users 以上都匹配不上 就会Home */}
      {/* <Redirect from="/home" to={Home} /> */}
    </Router>
  )
}

ReactDOM.render(<RouterApp />, document.getElementById('root'))

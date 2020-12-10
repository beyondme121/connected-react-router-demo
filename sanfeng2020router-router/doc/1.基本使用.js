import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from 'react-router-dom'

function Home() {
  return <div>Home</div>
}
function Product() {
  return <div>Product</div>
}
function User() {
  return <div>User</div>
}
function RouterApp() {
  return (
    <Router>
      <ul>
        {['home', 'user', 'product'].map((item) => (
          <Link to={`/${item}`}>{item}</Link>
        ))}
      </ul>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/user" component={User} />
        <Route path="/product" component={Product} />
        {/* 没有匹配上 会重定向到 Home组件 因为url中必然会是以 / 开头 */}
        {/* <Redirect from="/" to={Home} /> */}
        {/* 如果url为 /users 以上都匹配不上 就会Home */}
        <Redirect from="/home" to={Home} />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<RouterApp />, document.getElementById('root'))

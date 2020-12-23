import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from './react-router-dom'

function lazy(load) {
  return class extends React.Component {
    state = {
      InnerComponent: null,
    }
    componentDidMount() {
      load().then((result) => {
        this.setState({
          InnerComponent: result.default || result,
        })
      })
    }
    render() {
      console.log('lazy')
      debugger
      let { InnerComponent } = this.state
      return InnerComponent ? <InnerComponent /> : null
    }
  }
}

// 路由懒加载
const Home = lazy(() =>
  import(/* webpackChunkName: "Home"*/ './components/Home')
)
const Login = lazy(() =>
  import(/* webpackChunkName: "Login"*/ './components/Login')
)

const LazyHome = () => {
  return (
    <Suspense fallback={() => <></>}>
      <Home />
    </Suspense>
  )
}
const LazyLogin = () => {
  return (
    <Suspense fallback={() => <></>}>
      <Login />
    </Suspense>
  )
}

function RouterApp() {
  return (
    <Router>
      <Route path="/" component={LazyHome} exact />
      <Route path="/login" component={LazyLogin} />
    </Router>
  )
}

ReactDOM.render(<RouterApp />, document.getElementById('root'))

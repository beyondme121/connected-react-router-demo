import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
  withRouter,
} from './react-router-dom'

const Navigator = withRouter(function Navigator(props) {
  let title = '美好的一天'
  let handleClick = () => {
    props.history.push(`/post/${title}`, { message: 'message 123' })
  }
  return (
    <div>
      <ul>
        <li>
          <Link to="/post/helloworld">Post</Link>
        </li>
        <li>
          <button onClick={handleClick}>handleClick</button>
        </li>
      </ul>
    </div>
  )
})

function Post(props) {
  let params = useParams()
  let location = useLocation()
  let history = useHistory()
  console.log('params, location, history', params, location, history)
  console.log('props', props)
  return <div>Post</div>
}

function RouterApp() {
  return (
    <Router>
      <Navigator />
      <Route path="/post/:title" component={Post} />
    </Router>
  )
}

ReactDOM.render(<RouterApp />, document.getElementById('root'))

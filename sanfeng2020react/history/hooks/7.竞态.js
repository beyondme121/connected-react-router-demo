import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

// 竞态
let API = {
  async fetchData(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ id, title: `title_${id}` })
      }, 1000 * (5 - id))
    })
  },
}

function Article({ id }) {
  const [article, setArticle] = useState({})
  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      let article = await API.fetchData(id)
      if (!didCancel) {
        setArticle(article)
      }
    }
    fetchData(id)
    return () => {
      didCancel = true
    }
  }, [id])
  return (
    <div>
      <p>article comp</p>
      <p>{article.title}</p>
    </div>
  )
}
function App() {
  let [id, setId] = React.useState(1)
  return (
    <div>
      <p>id:{id}</p>
      <Article id={id} />
      <button onClick={() => setId(id + 1)}>改变id</button>
    </div>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))

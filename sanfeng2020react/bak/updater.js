class Updater {
  constructor() {
    this.state = { number: 0 }
    this.queue = []
  }

  setState(update) {
    this.queue.push(update)
  }

  forceUpdate() {
    for (let i = 0; i < this.queue.length; i++) {
      let updater = this.queue[i]
      if (typeof updater === 'object') {
        this.state = { ...this.state, ...updater }
      } else if (typeof updater === 'function') {
        this.state = {
          ...this.state,
          ...updater(this.state),
        }
      }
    }
  }
}

let up = new Updater()
up.setState({ number: 1 })
// up.setState((state) => ({
//   number: state.number + 100,
// }))

up.setState((state) => {
  return {
    number: state.number + 200,
  }
})
// up.setState({ number: 2 })
// up.setState({ number: 3 })

up.forceUpdate()
console.log(up.state.number)

import React, { Component } from 'react';

class Counter extends Component {

  state = {
    count: 0
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

export default Counter;
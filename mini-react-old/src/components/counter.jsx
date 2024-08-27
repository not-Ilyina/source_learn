import Component from "../../react/react";

export default class Counter extends Component {
  state = {
    count: 0,
  };

  handleClick = () => {
    console.log('1111', this);
    this.setState({
      count: this.state.count + 1,
    });
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me! Number of clicks: {this.state.count}
      </button>
    );
  }
}
    
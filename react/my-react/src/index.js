import React from './react';
// React 15


class SubCounter {
  componentWillMount() {
    console.log('子组件将要加载');
  }
  componentDidMount() {
    console.log('子组件完成加载');
  }
  render() {
    return '123';
  }
}

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { num: 1 };
  }
  componentWillMount() {
    console.log('父组件将要加载');
  }
  componentDidMount() {
    console.log('父组件完成加载');
    setInterval(() => {
      this.setState({ num: this.state.num + 1 });
    }, 2000);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate() {
    console.log('组件更新完成');
  }
  render() {
    return this.state.num;
    // return React.createElement(SubCounter, { name: 1 })
  }
}

function say() {
  alert(111);
}

// let element = <div name="xxx">hello jsx <button>123</button></div> //

// let element = React.createElement('div', { name: 'xxx' }, 'hello jsx',
//   React.createElement('button', { onClick: say, style: { color: 'red' } }, '123'));
// 跳过编译原理部分
React.render(React.createElement(Counter, { name: 'ddd' }), document.getElementById('root'));
// React.render(element, document.getElementById('root'));

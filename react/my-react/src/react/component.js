class Component {
    constructor(props) {
        this.props = props;
    }

    setState(partialState) {
        this._currentUnit.update(null, partialState); // null 新元素
    }
}

export default Component;

import { InstanceMap } from "./instanceMap";

export default class Component {
    static isClassComponent = true;
    constructor(props) {
        this.props = props;
    }

    setState(state) {
        const controller = InstanceMap.get(this);
        console.log("🚀 ~ Component ~ setState ~ controller:", controller)
        // controller.update(state);
    }
    
}
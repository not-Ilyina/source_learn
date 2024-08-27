function createStore(reducer) {
    let state;
    let listeners = [];

    function subscribe(callback) { // 订阅事件
        listeners.push(callback);
    }

    function dispatch(action) { // 事件发射
        state = reducer(state, action); // state 变更

        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    function getState() {
        return state;
    }

    // 取消订阅

    // store
    return {
        subscribe,
        dispatch,
        getState,
    }
}
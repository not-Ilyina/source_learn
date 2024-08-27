let memorizedState = [];
let cursor = 0;

function useState(initState) {
    memorizedState[cursor] = memorizedState[cursor] || initState;
    const currentCursor = cursor;
    function setState(newState) {
        memorizedState[currentCursor] = newState;
        render(); // diff 算法
    }

    return [memorizedState[cursor++, setState]];
}
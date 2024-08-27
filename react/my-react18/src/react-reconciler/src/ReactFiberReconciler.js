import { createFiberRoot } from './ReactFiberRoot.js';


export function createContainer(containerInfo) {
    return createFiberRoot(containerInfo);
}
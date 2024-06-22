
const PENDING = 'PENDING';
const FULFILLED = 'FULLFILLED';
const REJECTED = 'REJECTED';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        // 结果
        this.value = undefined;
        this.reason = undefined;

        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn(value)); // 链式调用
            }
        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn(reason));
            }
        }
        // 立即执行
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw new Error('err');
        };
        const self = this;
        return new Promise((resolve, reject) => {
            if (this.status === PENDING) {
                self.onFulfilledCallbacks.push(() => {
                    try {
                        setTimeout(() => { // 宏任务 setTimeout 模拟微任务
                            const res = onFulfilled(self.value);
                            res instanceof Promise ? res.then(resolve, reject) : resolve(res);
                        })
                    } catch (e) {
                        reject(e);
                    }
                });

                self.onRejectedCallbacks.push(() => {
                    try {
                        setTimeout(() => {
                            const res = onRejected(self.reason);
                            res instanceof Promise ? res.then(resolve, reject) : resolve(res);
                        })
                    } catch (e) {
                        reject(e);
                    }
                })
            } else if (self.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        const res = onFulfilled(self.value);
                        res instanceof Promise ? res.then(resolve, reject) : resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (self.status === REJECTED) {
                setTimeout(() => {
                    try {
                        const res = onRejected(self.reason);
                        res instanceof Promise ? res.then(resolve, reject) : resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    static resolve(value) {
        if (value instanceof Promise) {
            return value;
        } else {
            return new Promise((resolve, reject) => resolve(value));
        }
    }

    static reject(reason) {
        return new Promise((resolve, reject) => reject(reason));
    }
    // 在实现了 Promise 基础功能的基础上
    static all(promiseList) {
        const len = promiseList.length;
        const results = new Array(len);
        let count = 0;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < len; i++) {
                Promise.resolve(promiseList[i]).then((value) => {
                    results[i] = value;
                    count++;
                    if (count === len) {
                        resolve(results); //所有通过时，执行回调返回结果
                    }
                }, (reason) => {
                    reject(reason);
                })
            }
        })
    }

    static race(promiseList) {
        return new Promise((resolve, reject) => {
            promiseList.forEach(p => {
                Promise.resolve(p).then((value) => { resolve(value); }, (reason) => { reject(reason); })
            })
        })
    }
}
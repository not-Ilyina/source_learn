const FULFILLED = 'FULFILLED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

class MyPromise {
    constructor(executor) {
        this.state = PENDING;
        this.value = null;
        this.reason = null;

        this.onFulfilledCallback = [];
        this.onRejectedCallback = [];

        const resolve = (value) => {
            if (this.state === PENDING) {
                this.value = value;
                this.state = FULFILLED;
                this.onFulfilledCallback.forEach(fn => fn(value));
            }
        };
        const reject = (reason) => {
            if (this.state === PENDING) {
                this.reason = reason;
                this.state = REJECTED;
                this.onRejectedCallback.forEach(fn => fn(reason));
            }
        };

        executor(resolve, reject);
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : () => { throw Error('err') };
        const self = this;
        // 支持链式调用
        return new MyPromise((resolve, reject) => {
            if (self.state === FULFILLED) {
                // 开启微任务去执行
                try {
                    setTimeout(() => {
                        const res = onFulfilled(self.value);
                        res instanceof MyPromise ? res.then(resolve, reject) : resolve(res);
                    }); // 模拟微任务
                } catch (e) {
                    reject(e);
                }
            } else if (self.state === REJECTED) {
                try {
                    setTimeout(() => {
                        const res = onRejected(self.reason);
                        res instanceof MyPromise ? res.then(resolve, reject) : reject(res);
                    });
                } catch (e) {
                    reject(e);
                }
            } else if (self.state === PENDING) {
                self.onFulfilledCallback.push((value) => {
                    try {
                        setTimeout(() => {
                            const res = onFulfilled(value);
                            res instanceof MyPromise ? res.then(resolve, reject) : resolve(res);
                        })
                    } catch (e) {
                        reject(e);
                    }
                });
    
                self.onRejectedCallback.push((reason) => {
                    try {
                        setTimeout(() => {
                            const res = onRejected(reason);
                            res instanceof MyPromise ? res.then(resolve, reject) : reject(res);
                        })
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        });
    }

    catch(onRejected) {
        return this.then(_, onRejected);
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise((resolve) => { resolve(value) });
    }

    static rejetct(reason) {
        return new MyPromise((_, reject) => { reject(reason) });
    }

    static all(promiseList) {
        const n = promiseList.length;
        let count = 0;
        const vals = [];
        // 因为要合并为一个 Promise
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < n; i++) {
                MyPromise.resolve(promiseList[i]).then((value) => {
                    vals[i] = value; // 保存结果
                    count++;
                    if (count === n) resolve(vals); // 这里保证里返回结果数组和输入 Promise 数组顺序是一致的
                }, (reason) => {
                    reject(reason); // 有一个不成功就全部拒接
                })
            }
        });
    }

    static race(promiseList) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promiseList.length; i++) {
                MyPromise.resolve(promiseList[i]).then((value) => {
                    resolve(value);
                }, (reason) => {
                    reject(reason);
                })
            }
        })
    }
}
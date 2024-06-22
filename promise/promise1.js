const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

function MyPromise(executor) {
    this.state = PENDING; // 三个状态
    this.value = undefined; // 保存成功结果
    this.reason = undefined; // 保存失败结果
    const self = this;
    this.onFulfilledCallback = [];
    this.onRejectedCallback = [];

    function resolve(value) {
        if (self.state === PENDING) {
            self.state = FULFILLED;
            self.value = value;
            self.onFulfilledCallback.forEach(fn => fn(value));
        }
    }

    function reject(reason) {
        if (self.state === PENDING) {
            self.state = REJECTED;
            self.reason = reason;
            self.onRejectedCallback.forEach(fn => fn(reason));
        }
    }

    executor(resolve, reject);
}

MyPromise.resolve = function(value) { // 静态方法
    if (value instanceof Promise) return value;
    return new MyPromise((resolve) => resolve(value));
}

MyPromise.reject = function(reason) {
    if (reason instanceof Promise) return reason;
    return new MyPromise((_, reject) => reject(reason));
}

MyPromise.prototype.then = function(onFulfilled, onRejected) { // 实例方法
    onFulfilled =  typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => new Error(err);
    const self = this;

    return new MyPromise((resolve, reject) => {
        if (self.state === PENDING) {
            self.onFulfilledCallback.push(() => {
                try {
                    setTimeout(() => {
                        const res = onFulfilled(self.value);
                        res instanceof MyPromise ? res.then(resolve, reject) : resolve(res);
                    });
                } catch (e) {
                    reject(e);
                }
            });

            self.onRejectedCallback.push(() => {
                try {
                    setTimeout(() => {
                        const res = onRejected(self.reason);
                        res instanceof MyPromise ? res.then(resolve, reject) : reject(res);
                    })
                } catch (e) {
                    reject(e);
                }
            });
        } else if (self.state === FULFILLED) {
            try {
                setTimeout(() => {
                    const res = onFulfilled(self.value);
                    res instanceof MyPromise ? res.then(resolve, reject) : resolve(res);
                });
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
        }
    });
}

MyPromise.prototype.catch = function(onRejected) { // 实例方法
    return this.then(null, onRejected)
}

MyPromise.all = function(promiseList) {
    const n = promiseList.length;
    const vals = new Array(n); // 保存结果
    let count = 0;
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < n; i++) {
            MyPromise.resolve(promiseList[i]).then((value) => {
                vals[i] = value;
                count++;
                if (count === n) resolve(vals);
            }, err => reject(err));
        }
    });
}

// 返回空
MyPromise.race = function(promiseList) {
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < promiseList.length; i++) {
            MyPromise.resolve(promiseList[i]).then((value) => {
                resolve(value);
            }, (err) => reject(err));
        }
    });
}
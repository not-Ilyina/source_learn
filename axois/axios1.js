class MyAxios {
    constructor() {
        this.interceptor = {
            request: new MyInterceptorManager(),
            response: new MyInterceptorManager(),
        }
    }
    ajax(config) {
        return new Promise((resolve, reject) => {
            try {
                const { url = '', method = 'get', data = {} } = config || {};
                const xhr = new XMLHttpRequest();
                xhr.open(method, url, true); // 开启异步
                xhr.onload = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                            resolve(xhr.responseText);
                        } else {
                            reject('err');
                        }
                    }
                }
                xhr.send(data);
            } catch (e) {
                reject(e);
            }
        })

    }
    // 所以 Axios 拦截器的原理就是 Promise 的链式调用！！！

    request(config) {
        const chain = [this.ajax.bind(this), undefined];
        const requestInterceptorChain = [];
        this.interceptor.request.handlers.forEach(interceptor => {
            requestInterceptorChain.push(interceptor.fulfiled, interceptor.reject);
        });
        const responseInterceptorChain = [];
        this.interceptor.response.handlers.forEach(interceptor => {
            responseInterceptorChain.push(interceptor.fulfiled, interceptor.reject);
        });

        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        let promise = Promise.resolve(config); // 手写 Promise 时的链式调用就是这样的原理，上一个返回的结果作为下一个 Promise 的入参
        while (chain.length > 0) {
            promise = promise.then(chain.shift(), chain.shift()); // 拦截成功和拦截失败是一对函数
        }
        return promise;
    }

}

['get', 'post', 'delete', 'options', 'patch', 'head', 'put'].forEach((method) => {
    MyAxios.prototype[method] = function() {
        if (['get', 'delete', 'options', 'head'].includes(method)) {
            return this.request({
                method,
                url: arguments[0],
                ...arguments[1] || {},
            });
        } else {
            return this.request({
                method,
                url: arguments[0],
                data: arguments[1] || {},
                ...arguments[2] || {},
            });
        }
    }
});

const utils = {
    extends(a, b, context) {
        for (let key in b) {
            if (b.hasOwnProperty(key)) {
                if (typeof b[key] === 'function') {
                    a[key] = b[key].bind(context);
                } else {
                    a[key] = b[key];
                }
            }
        }
    }
}

class MyInterceptorManager {
    constructor() {
        this.handlers = [];
    }
    use(fulfiled, reject) { // 拦截器函数
        this.handlers.push({
            fulfiled,
            reject,
        });
    }
}

function createMyAxios() {
    const axois = new MyAxios();
    const request = axois.request.bind(axois); // 只有 Function 的原型才有 bind 方法
    utils.extends(request, axois, MyAxios);
    utils.extends(request, axois);
    return request;
}
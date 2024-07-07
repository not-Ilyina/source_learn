class Axios {
    constructor() {
        this.interceptor = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        }
    }
    /**
     * @param { Object }
     * @return { Promise }
     */
    ajax(config) {
        return new Promise((resolve, reject) => {
            const { method = 'get', url = '', data = {} } = config || {};
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            // 处理网络回调
            xhr.onload = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            xhr.send(data);
        });
    }
    request(config) {
        const chain = [this.ajax.bind(this), null];
        const requestInterceptorChain = [];
        this.interceptor.request.handlers.forEach(interceptor => {
            requestInterceptorChain.push(interceptor.onFulfilled, interceptor.onRejected);
        });

        const responseInterceptorChain = [];
        this.interceptor.response.handlers.forEach(interceptor => {
            responseInterceptorChain.push(interceptor.onFulfilled, interceptor.onRejected);
        });

        chain.unshift.apply(chain, requestInterceptorChain); // 放到业务前面
        chain.push.apply(chain, responseInterceptorChain); // 放到业务后面

        let promise = Promise.resolve(config);

        while (chain.length > 0) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }
}

// 单一职责设计
['get', 'head', 'options', 'delte', 'post', 'put', 'patch' ].forEach(met => {
    Axios.prototype[met] = function() {
        if (['get', 'head', 'options', 'delete'].includes(met)) {
            // 一个参数
            return this.request({
                method: met,
                url: arguments[0],
                ...arguments[1] || {},
            });
        } else {
            return this.request({
                method: met,
                url: arguments[0],
                data: arguments[1] || {},
                ...arguments[2] || {},
            })
        }
    }
});

utils = {
    // a 继承 b 的所有属性
    extends(a, b, context) {
        for (key in b) {
            if (b.hasOwnProperty(key)) {
                if (typeof b[key] === 'function') {
                    a[key] = b[key].bind(context);
                } else {
                    a[key] = b[key];
                }
            }
        }
    }
};

function createMyAxios() {
    const axios = new Axios();
    const request = axios.request.bind(axios);
    utils.extends(request, Axios.prototype, axios); // 只是添加了原型方法
    utils.extends(request, axios);
    return request;
}

class InterceptorManager {
    constructor() {
        this.handlers = [];
    }

    use(onFulfilled, onRejected) {
        this.handlers.push({
            onFulfilled,
            onRejected,
        });
    }
}
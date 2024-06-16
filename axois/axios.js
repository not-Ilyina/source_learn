class Axios {
    constructor() {
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        }
    }
    ajax(config) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            const {method = 'get', url = '', data = {}} = config || {};
            xhr.open(method, url, true); // 是否异步
            xhr.onload = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr === 304) {
                        resolve(xhr.responseText);
                    } else {
                        return Promise.reject('err');
                    }
                }
            }
            xhr.send(data);
        }, (err) => console.log(err))
    
    }
    request(config) {
        const chain = [this.ajax.bind(this), undefined];

        const requestInterceptorChain = [];
        this.interceptors.request.handlers.forEach(interceptor => {
            requestInterceptorChain.push(interceptor.fulfiled, interceptor.reject);
        });

        const responseInterceptorChain = [];
        this.interceptors.response.handlers.forEach(interceptor => {
            responseInterceptorChain.push(interceptor.fulfiled, interceptor.reject);
        });
        
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);

        let promise = Promise.resolve(config); // 顺序执行任务 参数逐级传递
        while (chain.length > 0) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
    }
}


['get', 'post', 'put', 'delete', 'options', 'patch', 'head'].forEach(method => {
    Axios.prototype[method] = function() {
        if (['get', 'delete', 'head', 'options'].includes(method)) {
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
})
utils = {
    extends(a, b, contex) {
        for (let key in b) {
            if (b.hasOwnProperty(key)) {
                if (typeof b[key] === 'function') {
                    a[key] = b[key].bind(contex);
                } else {
                    a[key] = b[key];
                }
            }
        }
    }
}


class InterceptorManager {
    constructor() {
        this.handlers = [];
    }
    use(fulfiled, reject) {
        this.handlers.push({
            fulfiled, 
            reject,
        });
    }
}
function creatAxios() {
    const axios = new Axios();

    const request = axios.request.bind(axios);

    utils.extends(request, Axios.prototype, axios); // 添加 method
    utils.extends(request, axios); // 添加拦截器

    return request;
}


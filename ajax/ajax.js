function ajax(config) {
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
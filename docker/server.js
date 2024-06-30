const express = require('express');
const fs = require('fs');
const app = express();
const html = fs.readFileSync('./index.html', { encoding: 'utf-8' });

app.get('/hello', function(req, res) {
    // res.send(html);
    fs.createReadStream('./index.html').pipe(res); // 创建可读流，可以提高性能
});

const server = app.listen(3000, function() {
    console.log('5005端口 服务器启动');
})
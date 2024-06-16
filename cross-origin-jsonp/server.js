var express = require('express'); 

const app = express();


app.get('/getJsonp', function(request, response){
    data = { 
        'FrontEnd':'前端', 
        'Sunny':'阳光' 
    }; 
    const res = `${request.query.cb}(${ JSON.stringify(data) });`;
    response.send(res); 
});

var server = app.listen(5001, function(){ 
    console.log("服务器启动"); 
});
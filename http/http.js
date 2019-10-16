var http = require('http');

var server = http.createServer((req,res,next)=>{
    res.end('hello world')
})

server.listen(4001,()=>{
    console.log('服务启动...');
})
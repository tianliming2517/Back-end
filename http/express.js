/**
 * 自动监听服务器
 * 全局安装 npm install -g supervisor
 * 执行文件  不是使用node 文件名 而是使用supervisor 文件名 
 * 使用node加文件名去执行，不会自动监听服务器
 */

var interfaces = require('os').networkInterfaces(); //  获取网关信息
var express = require('express');
var app = express();

// 自动监听 npm install -g supervisor
// supervisor 文件名  运行

// 获取本机电脑ip
var IPAdress = '';
for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            IPAdress = alias.address;
        }
    }
}

app.get('/', (req, res) => {
    let data = {
        info:{
            user:'田李明',
            age:20,
            gender:'男'
        }
    }
    res.send(data);
})

app.listen(3000, IPAdress, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('The server is running http://' + IPAdress + ':3000');  
    }
});
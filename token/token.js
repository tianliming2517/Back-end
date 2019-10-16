var jwt = require('jsonwebtoken');

// 用户信息
var user = {
    username:'田李明'
}
// 生成token
var token = jwt.sign(user,{

});

console.log(token)
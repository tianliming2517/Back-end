var jwt = require('jsonwebtoken');

var user = {
    username:'田李明'
}

var token = jwt.sign(user,'secret',{expiresIn:'2h'});

console.log(token)
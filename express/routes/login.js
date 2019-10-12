var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	// res.send('hello login')
	res.render('login', { data: '我是login的参数' });
})

module.exports = router;
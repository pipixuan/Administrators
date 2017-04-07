
var express = require('express');

var router = express.Router();

// 讲师表
var tcModel = require('../models/teacher');

module.exports = router;

router.get('/', function (req, res) {
	res.render('login/index', {});
});

router.post('/', function (req, res) {
	console.log(req.body);

	var body = req.body;

	tcModel.authored(body, function (err, result) {
		if(err) console.log(err);

		// console.log(result);
		// 记录登录状态
		req.session.loginfo = result[0];

		res.json({
			code: 10000,
			msg: '登录成功!',
			result: {}
		});
	});
});
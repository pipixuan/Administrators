
var express = require('express');

// 引入讲师数据模型
var tcModel = require('../models/teacher');

var router = express.Router();

module.exports = router;

// 展示讲师
router.get('/', function (req, res) {

	// 在渲染前调用M，将M的数据放到对象上
	// 调用model取数据
	
	tcModel.show(function (err, result) {
		if(err) return;

		// console.log(result);
		res.render('teachers/index', {teachers: result});
	});

	
});

router.get('/add', function (req, res) {
	res.render('teachers/add', {});
});

router.get('/edit/:tc_id', function (req, res) {
	// 讲师id
	var tc_id = req.params.tc_id;

	// 调用模型查询对应讲师的信息
	tcModel.find(tc_id, function (err, result) {

		if(err) return;

		console.log(result);
		
		res.render('teachers/add', {teacher: result[0]});
	});

});

// 添加讲师
router.post('/add', function (req, res) {
	
	// console.log(req.body);
	// post数据
	var body = req.body;

	// 调用model进行数据存储
	
	tcModel.add(body, function (err, result) {

		if(err) return;

		console.log('res');

		// 响应结果
		res.json({
			code: 10000,
			msg: '添加成功！',
			result: {}
		});

	});

});

// 编辑讲师
router.post('/edit', function (req, res) {

	// 将得到数据更新至数据库

	tcModel.edit(req.body, function (err, result) {

		if(err) return;

		res.json({
			code: 10000,
			msg: '修改成功!',
			result: {}
		});
	});
});

// 查看讲师资料
router.post('/preview', function (req, res) {

	// 通过xhr发送请求

	// 接收前端传过来的讲师ID
	// 利用ID查询
	console.log(req.body);

	var tc_id = req.body.tc_id;

	tcModel.find(tc_id, function (err, result) {

		if(err) return;

		// console.log(result);

		res.json(result[0]);

	});

});
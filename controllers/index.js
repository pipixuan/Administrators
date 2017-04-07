
var express = require('express');

var tcModal = require('../models/teacher');

var region = require('../models/region.json');

var path = require('path');

var rootPath = path.join(__dirname, '../');

// 引入上传包
var multer  = require('multer');

// 自定义存储路径
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, rootPath + 'uploads/avatars');
	},
	filename: function (req, file, cb) {

		// 原始名 + 时间 + 原始后缀
		var originalname = file.originalname;
		var lastIndex = originalname.lastIndexOf('.');

		var filename = originalname.slice(0, lastIndex);
		var fileExt = originalname.slice(lastIndex);

		cb(null, filename + '-' + Date.now() + fileExt);
	}
})

var upload = multer({ storage: storage });
// var upload = multer({ dest: rootPath + '/uploads' });

var router = express.Router();

module.exports = router;

router.get('/', function (req, res) {

	res.render('dashboard/index', {name: '传智播客'});
});

router.get('/settings', function (req, res) {

	// 根据用户登录信息再次查询结果
	var tc_id = req.session.loginfo.tc_id;

	tcModal.find(tc_id, function (err, result) {
		if(err) return;
		res.render('dashboard/settings', result[0]);
	});
});

// 完善讲师资料
router.post('/update', function (req, res) {

	console.log(req.body);

	var body = req.body;

	// 更新数据库
	tcModal.update(body, function (err, result) {
		if(err) console.log(err);

		res.json({
			code: 10000,
			msg: '更新成功!',
			result: {}
		});
		
	});
});

router.get('/repass', function (req, res) {
	res.render('dashboard/repass', {});
});

router.get('/region', function (req, res) {

	// res.send('请求地区');

	res.json(region);

});

// 上传头像
router.post('/upfile', upload.single('tc_avatar'), function (req, res) {

	// console.log(req.file);

	// res.send('上传头像');

	var body = {
		tc_id: req.session.loginfo.tc_id,
		tc_avatar: req.file.filename
	}

	// 保存头像
	tcModal.update(body, function (err, result) {
		if(err) return;

		res.json(req.file);
	});


});


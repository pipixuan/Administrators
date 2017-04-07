
var express = require('express');

// 分类模型
var cgModel = require('../models/category');

// 课时模块
var lsModel = require('../models/lesson');

var common = require('../utils/common');

// 讲师模型
var tcModel = require('../models/teacher');

// 课程模型
var csModel = require('../models/course');

var path = require('path');

var rootPath = path.join(__dirname, '../');

// 上传文件
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, rootPath + 'uploads/original');
	},
	filename: function (req, file, cb) {

		var originalname = file.originalname;

		var fileName = originalname.slice(0, originalname.lastIndexOf('.'))
		var fileExt = originalname.slice(originalname.lastIndexOf('.'));

		cb(null, fileName + '-' + Date.now() + fileExt);
	}
})
 
var upload = multer({ storage: storage });

var router = express.Router();

module.exports = router;

router.get('/add', function (req, res) {

	res.render('courses/add');

});

router.get('/list', function (req, res) {

	// 取出所有的课程
	csModel.list(function (err, result) {
		if(err) return;

		console.log(result);

		res.render('courses/list', {courses: result});		
	});
});

router.get('/category', function (req, res) {

	// 查询所有分类
	cgModel.list(function (err, result) {
		if(err) return;

		var tree = common.getTree(result, 0);

		// res.json(tree);

		res.render('courses/category', {categorys: tree});
	});

});

router.get('/category/add', function (req, res) {

	// 取分类
	cgModel.show(function (err, result) {

		if(err) return;

		res.render('courses/category_add', {categorys: result});

	});
});

router.post('/category/add', function (req, res) {

	cgModel.add(req.body, function (err, result) {

		if(err) return;

		res.json({
			code: 10000,
			msg: '添加成功!',
			result: {}
		});

	});

});

router.post('/category/update', function (req, res) {

	cgModel.update(req.body, function (err, result) {

		if(err) return;

		res.json({
			code: 10000,
			msg: '修改成功!',
			result: {}
		});

	});

});

router.get('/category/edit/:cg_id', function (req, res) {

	var cg_id = req.params.cg_id;

	// 编辑分类
	
	cgModel.show(function(err, all) {
		if(err) return;

		cgModel.find(cg_id, function (err, child) {
			if(err) return;

			res.render('courses/category_add', {categorys: all, child: child[0]});
		});	

	})

});

router.post('/add', function (req, res) {

	console.log(req.body);
	// 调用模型添加数据
	csModel.add(req.body, function (err, result) {
		if(err) return;

		res.json({
			code: 10000,
			msg: '添加成功!',
			result: {
				insertId: result.insertId
			}
		});	
	})
})

router.get('/basic/:cs_id', function (req, res) {
	var cs_id = req.params.cs_id;

	var data = {};

	// 查出当前课程信息
	csModel.find(cs_id, function (err, result) {
		if(err) return;

		// 课程信息
		data.course = result[0];

		tcModel.show(function (err, rows) {
			if(err) return;

			// 讲师数据
			data.teachers = rows;

			cgModel.getParent(result[0]['cs_cg_id'], function (err, cats) {
				if(err) return;

				var parents = [];
				var childs = [];

				for(var i=0; i<cats.length; i++) {
					if(cats[i]['cg_pid'] == 0) {
						parents.push(cats[i]);
						continue;
					}
					childs.push(cats[i]);
				}

				var category = {
					parents: parents,
					childs: childs
				}

				// 处理分类数据
				data.category = category;

				res.render('courses/basic', data);
			});
		});

	});

});

router.post('/basic', function (req, res) {

	var cs_id = req.body.cs_id;

	// 调用模型添加数据
	csModel.update(req.body, function (err, result) {
		if(err) console.log(err);

		res.json({
			code: 10000,
			msg: '添加成功',
			result: {
				cs_id: cs_id
			}
		});
	});
});

// 添加封面图
router.get('/picture/:cs_id', function (req, res) {
	// 课程ID
	var cs_id = req.params.cs_id;

	csModel.find(cs_id, function (err, result) {

		if(err) return;

		var tc_id = result[0]['cs_tc_id'];

		tcModel.find(tc_id, function (err, rows) {
			if(err) return;

			res.render('courses/picture', {course: result[0], teacher: rows[0]});
		});

	});
});

router.post('/getChild', function (req, res) {

	var cg_id = req.body.cg_id;

	cgModel.getChild(cg_id, function (err, result) {
		if(err) return;

		res.json({
			code: 10000,
			msg: '获取成功!',
			result: result
		});
	})
})

// 上传文件
router.post('/upfile', upload.single('upfile'), function (req, res) {

	// 将原始图片也要存入数据
	// 方便下次用户修改
	
	console.log(req.file);
	// 字段数据
	var body = {
		cs_cover_original: req.file.filename,
		cs_id: req.body.cs_id
	}

	// 存入数据库
	csModel.update(body, function (err, result) {
		if(err) return;

		res.json(req.file);		
	});

});

router.post('/crop', function (req, res) {

	// 接收参数
	// 调用裁切工具
	// 将裁切好的图片存到数据库

	var x = req.body.x,
		y = req.body.y,
		w = req.body.w;
		h = req.body.h;
		filename = req.body.cs_cover_original;

	// 调用裁切方法
	common.crop(x, y, w, h, filename, function (path) {
		// 裁切完成后入库拼凑参数
		var body = {
			cs_cover: path,
			cs_id: req.body.cs_id
		}

		// 入库
		csModel.update(body, function (err, result) {
			if(err) return;

			res.json({
				code: 10000,
				msg: '裁切成功!',
				result: {
					cs_id: req.body.cs_id
				}
			})
		});

	});

});

// 展示视图
router.get('/lesson/:cs_id', function (req, res) {

	// 根据ID 取出课程信息
	var cs_id = req.params.cs_id;

	var data = {};

	// 课程信息
	csModel.find(cs_id, function (err, result) {

		if(err) return;

		// 查询出课程信息
		data.course = result[0];
		// 讲师ID
		var cs_tc_id = result[0].cs_tc_id;

		// 讲师信息
		tcModel.find(cs_tc_id, function (err, rows) {
			if(err) return;
			// 讲师信息
			data.teacher = rows[0];

			var ls_cs_id = cs_id;
			// 课时
			lsModel.find(ls_cs_id, function (err, lesson) {
				if(err) return;
				// 对应的课时
				data.lessons = lesson;

				console.log(lesson);

				res.render('courses/lesson', data);
			});
		});

	});
});

// 添加课时
router.post('/lesson', function (req, res) {

	// 有ID（编辑） 和 没有ID（添加）

	var ls_minutes = req.body.ls_minutes;
	var ls_seconds = req.body.ls_seconds;

	req.body.ls_video_duration = ls_minutes + ':' + ls_seconds;

	delete req.body.ls_minutes;
	delete req.body.ls_seconds;

	// 将接收数据添加到数据库
	lsModel.add(req.body, function (err, result) {

		if(err) return;

		// console.log(result);

	});

	res.send('111');

});

// 编辑课时
router.post('/lesson/edit', function (req, res) {
 
 	var ls_id = req.body.ls_id;

	lsModel.show(ls_id, function (err, result) {
		if(err) return;

		res.json(result[0]);
	});

})
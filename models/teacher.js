
// 处理teacher数据表的数据

var db = require('../config/db');

// 下一步通过db处理数据

// 添加数据
exports.add = function (body, callback) {

	// body 即表单数据
	
	// 插入操作
	db.query('INSERT INTO `teacher` SET ?', body, callback);

}

// 编辑
exports.edit = function (body, callback) {

	var tc_id = body.tc_id;

	delete body.tc_id;

	// tc_id = body.tc_id

	var query = 'UPDATE `teacher` SET ? WHERE `tc_id` = ' + tc_id;

	db.query(query, body, callback);
}

// 查询所有讲师
exports.show = function (callback) {

	db.query('SELECT * FROM `teacher`', callback);

}

// 查询单个讲师
exports.find = function (tc_id, callback) {
	// 根据讲师id查询
	
	var query = 'SELECT * FROM `teacher` WHERE tc_id = ' + tc_id;

	db.query(query, callback);

}

exports.authored = function (body, callback) {

	// 利用用户名和密码查询信息
	var tc_name = body.tc_name;
	var tc_pass = body.tc_pass;

	// 密码未加密
	
	var query = 'SELECT * FROM `teacher` WHERE `tc_name`="'+tc_name+'" AND `tc_pass`="' + tc_pass + '"';

	db.query(query, callback);

}

// 完善讲师资料
exports.update = function (body, callback) {

	var tc_id = body.tc_id;

	delete body.tc_id;

	var query = 'UPDATE `teacher` SET ? WHERE `tc_id`=' + tc_id;

	db.query(query, body, callback);
}
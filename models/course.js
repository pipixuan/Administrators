
var db = require('../config/db');

exports.add = function (body, callback) {

	var query = 'INSERT INTO `course` SET ?';

	db.query(query, body, callback);

	// console.log(sql);

}

exports.find = function (cs_id, callback) {

	var query = 'SELECT * FROM `course` WHERE `cs_id`=' + cs_id;

	db.query(query, callback);
}

exports.update = function (body, callback) {

	var cs_id = body.cs_id;

	delete body.cs_id;

	var query = 'UPDATE `course` SET ? WHERE cs_id=' + cs_id;

	db.query(query, body, callback);

}

exports.list = function (callback) {

	// 可以通联表查询将此课下的讲师、分类、课时、用户

	// mysql 知识不够，只查询课程信息

	var query = 'SELECT * FROM `course`';

	db.query(query, callback);
}
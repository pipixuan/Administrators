
var db = require('../config/db');

exports.add = function (body, callback) {

	var ls_id = body.ls_id;

	delete body.ls_id;

	if(ls_id) {
		var query = 'UPDATE `lesson` SET ? WHERE `ls_id`=' + ls_id;
	} else {
		var query = 'INSERT INTO `lesson` SET ?';
	}

	db.query(query, body, callback);
}

exports.find = function (ls_cs_id, callback) {

	var query = 'SELECT * FROM `lesson` WHERE `ls_cs_id`=' + ls_cs_id;

	db.query(query, callback);

}

exports.show = function (ls_id, callback) {

	var query = 'SELECT * FROM `lesson` WHERE `ls_id`=' + ls_id;

	db.query(query, callback);
}


var gm = require('gm');

var path = require('path');

var rootPath = path.join(__dirname, '../');

exports.getTree = getTree;


function getTree(data, pid) {

	var arr = [];
	var args = arguments;

	(function () {

        for(var i=0; i<data.length; i++) {
            if(data[i]['cg_pid'] == pid) {

                data[i].childs = [];

                if(args[2]) {
                    args[2].push(data[i]);
                } else {
                    arr.push(data[i]);
                }

                getTree(data, data[i]['cg_id'], data[i].childs);
            }
        }

	})()

	return arr;
}

exports.crop = function (x, y, w, h, filename, callback) {

    // 将裁切后的图片进存储时，需要明确后缀
    var fileExt = filename.slice(filename.lastIndexOf('.'));
    var fileName = Date.now();

    // 
    gm(rootPath + '/uploads/original/' +filename)
    .crop(w, h, x, y)
    .write(rootPath + '/uploads/thumbs/' + fileName + fileExt, function () {
        console.log('done');

        callback(fileName + fileExt);
    });

}
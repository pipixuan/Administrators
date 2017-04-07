define(function (require, exports, module) {

	var $ = require('jquery');

	// 引入省市县插件
	require('region');

	// 引入表单插件
	require('form');

	// 引入文件上传插件
	require('uploadify');

	// 日期插件
	require('datepicker');

	// 汉化
	require('language');

	var ck = require('ckeditor');

	ck.replace('teacherIntroduce');

	$('.datepicker').datepicker({
		format: 'yyyy-mm-dd',
		language: 'zh-CN'
	});

	// 省市县
	$('.hometown').region({
		url: '/region'
	});

	// 提交表单数据
	$('#updateTeacher').on('submit', function () {

        // 提交ckeditor数据
        for(instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }

		$(this).ajaxSubmit({
			url: '/update',
			type: 'post',
			success: function (data) {
				console.log(data);

				alert(data.msg);

				if(data.code == 10000) {
					location.reload();
				}
			}
		});

		return false;

	});

	$('#upfile').uploadify({
		buttonText: '',
		height: '120px',
		fileObjName: 'tc_avatar',
		swf: '/assets/uploadify/uploadify.swf', // flash文件路径
		uploader: '/upfile', // 后台接口
		itemTemplate: '<span></span>',
		onUploadSuccess: function (file, data) {
			console.log(data);

			var data = JSON.parse(data);

			$('.preview img').attr('src', '/avatars/' + data.filename);
		}
	});

});
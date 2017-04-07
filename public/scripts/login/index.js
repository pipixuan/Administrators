
define(function (require, exports, module) {

	var $ = require('jquery');

	require('form');

	$('#login').on('submit', function () {
		// 此插件提供功能是让表单以异步形式提交
		// 此插件与$.ajax非常类似
		$(this).ajaxSubmit({
			url: '/login',
			type: 'post',
			success: function (data) {
				
				alert(data.msg);

				if(data.code == 10000) {
					location.href = '/';
				}
			}
		});

		return false;

	});

});
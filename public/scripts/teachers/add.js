define(function (require, exports, module) {

	var $ = require('jquery');

	require('validate');

	require('form');

	require('datepicker');

	require('language');

	// console.log($);
	
	// 表单元素.validate
	$('#addTeacher').validate({
		onKeyup: true, // 何种条件下触发验证
		sendForm: false, // 阻止表单默认提交
		eachInvalidField: function () {
			// 当元不合法时，会触此方法

			// $(this) 指的不合法的表单
			$(this).parents('.form-group')
			.removeClass('has-success')
			.addClass('has-error');

			$(this).next()
			.removeClass('glyphicon-ok')
			.addClass('glyphicon-remove');
		},
		eachValidField: function () {
			$(this).parents('.form-group')
			.addClass('has-success')
			.removeClass('has-error');

			$(this).next()
			.addClass('glyphicon-ok')
			.removeClass('glyphicon-remove');
		},
		valid: function () {
			// 所有表单元素都合法才触发
			// jquery.form.js专门ajax提交表单的
			
			var url = $(this).attr('action').trim();
			// $(this) 指的form
			$(this).ajaxSubmit({
				url: url,
				type: 'post',
				success: function (info) {

					alert(info.msg);

					if(info.code == 10000) {
						location.reload();
					}
				}
			});
		}
	});

});
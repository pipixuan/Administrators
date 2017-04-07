
define(function (require, exports, module) {

	var $ = require('jquery');

	require('form');

	var template = require('template');

	// 模态框
	var lessonModal = $('#lesson');
	var item = $('#item');
	var total = $('#total');
	var save = $('#save');

	$('#addBtn').on('click', function () {
		// 调用模板引擎
		var html = template('lessonTpl', {});
		// 将表单元素追加
		lessonModal.find('form').html(html);

		// 显示
		lessonModal.modal();

		return false;
	});

	// 添加课时
	$('#addLesson').on('submit', function () {
		// 按钮状态
		var key = $(this).attr('data-key');

		var lsName = $('[name="ls_name"]').val();	
		var lsMinutes = $('[name="ls_minutes"]').val();	
		var lsSeconds = $('[name="ls_seconds"]').val();
		var size = item.children().size() + 1;

		$(this).ajaxSubmit({
			url: '/course/lesson',
			type: 'post',
			success: function (data) {

				// 添加成功，需要展示新添加数据
				var info = {
					index: size,
					lsName: lsName,
					lsDuration: lsMinutes + ':' + lsSeconds
				}
				// 调用模板
				var html = template('itemTpl', info);

				if(key) {
					// 替换
					item.find('li').eq(key).find('span.name').text(lsName);
					item.find('li').eq(key).find('span.duration').text(lsMinutes + ':' + lsSeconds);
				} else {
					// 添加DOM
					item.append(html);
				}

				// 总课时
				total.text('课时 : ' + size);

				// 隐藏模态框
				lessonModal.modal('hide');
			}
		});

		return false;
	});

	// 
	item.on('click', '.btn', function () {
		var _this = $(this);
			parent = _this.parents('li'),

			ls_id = parent.attr('data-id'),

			key = parent.index();

		// 编辑
		if(_this.is('.edit')) {
			// 改变标识
			save.attr('data-key', key);

			var prev = _this.parents('li').prev();

			$.ajax({
				url: '/course/lesson/edit',
				type: 'post',
				data: {ls_id: ls_id},
				success: function (data) {

					// 调用模板引擎
					// data 需要处理，将时长拆开
					var html = template('lessonTpl', data);

					$('#addLesson').html(html);

					lessonModal.modal();
				}
			});

		}

		if(_this.is('.preview')) {
			alert('预览')
		}

		if(_this.is('.delete')) {
			alert('删除');
		}

	});

});
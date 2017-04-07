define(function (require, exports, module) {

	var $ = require('jquery');

	require('form');

	require('uploadify');

	require('Jcrop');

	var preview = $('.preview img');
	var jcrop_api;

	function imgCrop () {

		if(jcrop_api) {
			jcrop_api.destroy();
		}
		
		preview.Jcrop({
			boxWidth: 400,
			aspectRatio: 2
		}, function () {

			jcrop_api = this;
			// 在回调函数中设置默认选区
			
			var width = this.ui.stage.width;
			var height = this.ui.stage.height;

			var x, y, w, h;

			x = 0;
			y = (height - width / 2) / 2;
			w = width;
			h = width / 2;

			this.newSelection();
			this.setSelect([ x, y, w, h ]);

  			thumbnail = this.initComponent('Thumbnailer', { width: 240, height: 120, thumb: '.thumb' });

  			$('.jcrop-thumb').css({
  				left: 0,
  				top: 0
  			})
		});
	}

	// 给图片的父元素添加事件
	preview.parent().on('cropmove cropend', function (selection, coords, c) {
		$('#x').val(c.x);
		$('#y').val(c.y);
		$('#w').val(c.w);
		$('#h').val(c.h);
	});

	// 裁切
	$('#cutBtn').on('click', function () {

		var status = $(this).attr('data-status');

		if(status == 'cut') {
			imgCrop();

			$(this).val('保存图片');
			$(this).attr('data-status', 'save');
			return;
		}

		$('#coords').ajaxSubmit({
			url: '/course/crop',
			type: 'post',
			success: function (data) {
				console.log(data);

				if(data.code == 10000) {
					location.href = '/course/lesson/' + data.result.cs_id;
				}
			}
		});

		return false;

	});

	$('#upfile').uploadify({
		width: '85px',
		height: 'auto',
		fileObjName: 'upfile', // 上传文件的key，相当于file表单name
		formData: {cs_id: $('#csId').val()}, // 参数，相当于jquery的data
		buttonClass: 'btn btn-success btn-sm',
		fileSizeLimit: '2MB',
		fileTypeExts:  '*.gif; *.jpg; *.png',
		buttonText: '选择图片',
		swf: '/assets/uploadify/uploadify.swf',
		uploader: '/course/upfile',
		itemTemplate: '<span></span>',
		onUploadSuccess: function (file, data) {

			var data = JSON.parse(data);
			// 预览图片
			preview.attr('src', '/original/' + data.filename);
			// 将图片路径存入表单
			$('#cover').val(data.filename);
			// 改变按钮状态
			$('#cutBtn').prop('disabled', false);
			$('#cutBtn').val('保存图片').attr('data-status', 'save');
			// 调用裁切
			imgCrop();
		}
	});

});
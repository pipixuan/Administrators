define(function (require, exports, module) {

	var $ = require('jquery');

	require('form');

	$('#addCategory').on('submit', function () {

		var url = $(this).attr('action').trim();

		$(this).ajaxSubmit({
			url: url,
			type: 'post',
			success: function (data) {
				
				alert(data.msg);

				if(data.code == 10000) {
					location.reload();
				}
			}
		});

		return false;

	});

});

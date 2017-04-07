	
// 配置
seajs.config({
	base: '/assets',
	alias: {
		jquery: 'jquery/jquery.js',
		validate: 'jquery-validate/jquery-validate.js',
		form: 'jquery-form/jquery.form.js',
		region: 'jquery-region/jquery.region',
		uploadify: 'uploadify/jquery.uploadify.js',
		Jcrop: 'Jcrop/js/Jcrop.js',
		bootstrap: 'bootstrap/js/bootstrap.js',
		datepicker: 'bootstrap-datepicker/js/bootstrap-datepicker',
		language: 'bootstrap-datepicker/js/bootstrap-datepicker.zh-CN.min.js',
		template: 'artTemplate/template-native.js',
		nprogress: 'nprogress/nprogress.js',
		ckeditor: 'ckeditor/ckeditor.js'
	},
	// 实现全局模块提前加载
	// 在使用use后才会执行
	// 但是提前于use
	preload: ['/scripts/common', 'bootstrap']
});
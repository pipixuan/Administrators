
var express = require('express');

var bodyParser = require('body-parser');

// cookie中间件
var cookieParser = require('cookie-parser');

// session中间件
var session = require('express-session');

var app = express();

// 指定模板放在哪里了？
app.set('views', './views');
// 指定使用哪个模板引擎
app.set('view engine', 'xtpl');

// 应用cookie中间件
// 此中间件就会在响应中设置cookie方法
app.use(cookieParser());

// 应用session中间件
// 请求上添加一个属性session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  cookie: {maxAge: 60 * 60 * 24}
}));

// 解析 application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// 设置目录
app.use('/', express.static('public'));
app.use('/', express.static('uploads'));

app.use(function (req, res,next) {
	var url = req.originalUrl;

	// app.locals.demo = '你好';
	// express提供一个全局的对象
	// 在些对象的数据可以任何视图上获得

	// 登录信息
	// var loginfo = req.session.loginfo;

	// app.locals.loginfo = loginfo;
	
	// if(url != '/login' && !loginfo) {
	// 	return res.redirect('/login');
	// }

	next();
});

var index = require('./controllers/index');
var user = require('./controllers/user');
var teacher = require('./controllers/teacher');
var login = require('./controllers/login');
var course = require('./controllers/course');

app.use('/', index);
app.use('/user', user);
app.use('/teacher', teacher);
app.use('/login', login);
app.use('/course', course);

app.listen(3000);
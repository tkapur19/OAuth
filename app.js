var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passportSetup=require('./config/passport-setup');
var cookieSession=require('cookie-session');
var passport=require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auth=require('./routes/Auth');
var profile=require('./routes/profile');

var keys=require('./Key/keys');


var app = express();

var mongoose=require('mongoose');
mongoose.connect(keys.mogoDb.mongoURL,function () {
console.log('mongoDb connesction is successful');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handle cookie-session
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookie]
}));
//Initialise passport for creating session
app.use(passport.initialize());
app.use(passport.session());


//app.use('/', indexRouter);
app.get('/',function (req,res) {
    res.render('home');
});
app.use('/users', usersRouter);
app.use('/auth',auth)
app.use('/profile',profile);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formRouter = require('./routes/form');
var compRouter = require('./routes/complete');
var delRouter = require('./routes/delete');
var registRouter = require('./routes/regist');
var loginRouter = require('./routes/login');
var updHotelRouter = require('./routes/updHotel');
var delHotelRouter = require('./routes/delHotel');

var app = express();
_mysqlConnection = require('./public/javascripts/mysqlConnection.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/form', formRouter);
app.use('/complete', compRouter);
app.use('/delete', delRouter);
app.use('/regist', registRouter);
app.use('/login', loginRouter);
app.use('/updHotel', updHotelRouter);
app.use('/delHotel', delHotelRouter);

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

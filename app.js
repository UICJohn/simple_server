var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyparser = require("body-parser");
const mongoose   = require("mongoose");
const indexRouter = require("./routes/index")
const objectRouter = require("./routes/object")

require('dotenv').config();


if(process.env.NODE_ENV === 'test'){
  mongoose.connect(process.env.DATABASE_URI_TEST, {useNewUrlParser: true, useUnifiedTopology: true});
} else {
  mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true});
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded( {extended: true} ));
app.use(logger('dev'));



app.use('/', indexRouter)
app.use('/object', objectRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)

  // render the error page
  res.status(err.status || 500);
  res.json({error: 'error'});
});

module.exports = app;

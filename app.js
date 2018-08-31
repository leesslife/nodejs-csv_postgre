var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs=require('fs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mutipart=require('connect-multiparty');
var mutipartMiddeware=mutipart();
var app = express();
//ar csv=require('csv');
// view engine setup
var parse=require('csv-parse');
app.use(mutipart({uploadDir:'./lees'}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var csvData=[];
app.post('/upload',mutipartMiddeware,function(req,res){
  var tmppath=req.files.myfile.path;
  fs.createReadStream(__dirname+'/'+tmppath)
    .pipe(parse({delimiter:"\n"}))
    .on('data',function(csvrow){
      console.log(csvrow);
      csvData.push(csvrow);
    })
    .on('end',function(){
      console.log(csvData);
    });
  res.send('success');
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
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

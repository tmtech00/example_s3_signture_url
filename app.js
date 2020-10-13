var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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

var req = require('request');
var fs = require('fs');
var AWS = require('aws-sdk');

async function getSignedUrl() {
    var s3 = new AWS.S3();

    var params = {
        Bucket: 'dev-media-convert-input',
        Key: 'test.txt',
        Expires: 60,
    };
    var url = await s3.getSignedUrl('putObject', params);
    console.log(url);
    fs.readFile('test.txt', function(err, data) {
        console.log(data);
        if (err) {
            return console.log('error', err);
        }
        req({
            method: "PUT",
            url: url,
            body: data
        }, function(err, res, body) {
            console.log('body', err, res, body);
        })
    });
}

getSignedUrl();
module.exports = app;
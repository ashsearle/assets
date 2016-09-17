var async = require('async');
var express = require('express');
var fs = require('fs');
var path = require('path');

var resolveData = require('../../lib/data');

var fixtures = path.join(__dirname, '..', 'fixtures');

module.exports = function (callback) {
  fs.readdir(fixtures, function (err, files) {
    if (err) return callback(err);

    async.map(files.sort(), function (file, cb) {
      resolveData(path.join(fixtures, file), cb);
    }, function (err, data) {
      if (err) return callback(err);

      var app = express();
      app.set('views', __dirname);
      app.set('view engine', 'ejs');

      app.get('/', function (req, res) {
        res.render('index', {
          data: data
        });
      });

      var server = app.listen(3000, function () {
        callback(null, server);
      });
    });
  });
};


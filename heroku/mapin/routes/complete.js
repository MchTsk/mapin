var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

/* GET index page. */
router.get('/', function (req, res, next) {
  res.render('complete', {
    title: '登録完了'
  });
});

module.exports = router;
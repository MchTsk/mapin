var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

/* GET index page. */
router.get('/', function (req, res, next) {
  res.render('form', {
    title: 'ホテル情報登録フォーム'
  });
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('INSERT!!!!!!!!!');
  console.log(req.body.hotelName);
  const name = req.body.hotelName;
  const lat = req.body.latitude;
  const lng = req.body.longitude;
  const url = req.body.hpUrl;

  connection.query('INSERT INTO hotelInfo(name,lat,lng,url) VALUES(?,?,?,?);', [name, lat, lng, url], (error, response) => {
    if (error) {
      console.error('Insert Error:' + error);
      res.render('error', {});
    } else {
      console.log('Insert Success');
      res.render('complete', {title: '登録完了'});
    }
    return;
  });
});

module.exports = router;
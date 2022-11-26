var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

const com = require('../public/javascripts/commonCustom.js');

var uid = '';

/* GET index page. */
router.get('/', function (req, res, next) {
  console.log('form初期表示処理開始');
  uid = '';
  if(req.url.indexOf('?') != -1) {
    // uid
    var uidPrm = req.url.split('?')[1].split('=')[0];
    if(uidPrm == 'uid') {
      uid = req.url.split('=')[1].split('&')[0];
    }
    console.log('uid：' + uid);
  }
  if(uid) {
    // 共通処理（セッションタイムアウト処理）
    com.sessionRender(connection, res, uid).then(() => {
      // 登録フォーム画面遷移処理へ
      res.render('form', {
        title: 'ホテル情報登録フォーム'
      });
    }).catch((e) => {
      // エラー
      console.log(e);
      res.render('error', {});
    })
  } else {
    res.render('login', {
      title: 'ログイン画面',
      error: '',
      loginId: '',
      password: ''
    });
  }
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('INSERT!!!!!!!!!');
  console.log(req.body.hotelName);
  const name = req.body.hotelName;
  const lat = req.body.latitude;
  const lng = req.body.longitude;
  const url = req.body.hpUrl;
  console.log(uid);
  
  if(!uid) {
    res.render('error', {});
  }

  connection.query('INSERT INTO hotelInfo(name,lat,lng,url,userId,delFlg) VALUES(?,?,?,?,?,?);', [name, lat, lng, url, uid, 0], (error, response) => {
    if (error) {
      console.error('Insert Error:' + error);
      res.render('error', {});
    } else {
      console.log('Insert Success');
      res.writeHead(301, { Location: "/complete/?uid=" + uid + "&comp=regHotel" });
      res.end();
    }
    return;
  });
});

module.exports = router;
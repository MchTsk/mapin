var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

const com = require('../public/javascripts/commonCustom.js');

var uid = '';
var hid = '';

/* GET index page. */
router.get('/', function (req, res, next) {
  console.log('updHotel初期表示処理開始');
  uid = '';
  hid = '';
  if(req.url.indexOf('?') != -1) {
    // uid
    var uidPrm = req.url.split('?')[1].split('=')[0];
    if(uidPrm == 'uid') {
      uid = req.url.split('=')[1].split('&')[0];
    }
    console.log('uid：' + uid);
    // hid
    var hidPrm = req.url.split('&')[1].split('=')[0];
    if(hidPrm == 'hid') {
      hid = req.url.split('=')[2].split('&')[0];
    }
    console.log('hid：' + hid);
  }
  if(uid && hid) {
    // 共通処理（セッションタイムアウト処理）
    com.sessionRender(connection, res, uid).then(() => {
      // ホテル情報取得・編集フォーム画面遷移処理へ
      getHotelReder(res, hid);
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
  console.log('UPDATE!!!!!!!!!');
  console.log(req.body.hotelName);
  const name = req.body.hotelName;
  const lat = req.body.latitude;
  const lng = req.body.longitude;
  const url = req.body.hpUrl;
  console.log(uid);
  
  if(!uid || !hid) {
    res.render('error', {});
  }

  connection.query('UPDATE hotelInfo SET name = ?, lat = ?, lng = ?, url = ? WHERE id = ?;', [name, lat, lng, url, hid], (error, response) => {
    if (error) {
      console.error('Update Error:' + error);
      res.render('error', {});
    } else {
      console.log('Update Success!!!');
      res.writeHead(301, { Location: "/complete/?uid=" + uid + "&comp=updHotel" });
      res.end();
    }
    return;
  });
});

// ホテル情報取得
const getHotelReder = (res, id) => {
  connection.query('SELECT name, lat, lng, url FROM hotelInfo WHERE id = ? AND delFlg <> 1 LIMIT 1;', [id], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success!!!');
      if(Object.keys(response).length == 0) {
        res.writeHead(301, { Location: "/?uid=" + uid });
        res.end();
      } else {
        res.render('updHotel', {
          title: 'ホテル情報更新フォーム',
          name: response[0].name,
          lat: response[0].lat,
          lng: response[0].lng,
          url: response[0].url
        });
      }
    }
    return;
  });
}

module.exports = router;
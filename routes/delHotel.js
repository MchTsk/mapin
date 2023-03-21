var express = require('express');
var session = require('express-session');
var router = express.Router();
const app = express();

// Require mysqlConnection
// const connection = require('../public/javascripts/mysqlConnection');
const connection = require('../db/pool');

var hid = '';

// セッション情報
router.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    secure: false,
    // 有効期限：30分
    maxAge: 1000 * 60 * 30
  }
}));

/* GET index page. */
router.get('/', function (req, res, next) {
  console.log('delHotel初期表示処理開始');

  var uid = req.session.userId;
  hid = '';

  if(req.url.indexOf('?') != -1) {
    // hid
    var hidPrm = req.url.split('?')[1].split('=')[0];
    if(hidPrm == 'hid') {
      hid = req.url.split('=')[1];
    }
    console.log('hid：' + hid);
  }

  if(uid) {
    if(hid) {
      // ホテル情報取得・削除確認画面遷移処理へ
      getHotelReder(res, uid, hid);
    } else {
      // ホームへ画面遷移
      res.redirect('/');
    }
  } else {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、ログアウトしました。',
      loginId: '',
      password: ''
    });
  }
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('UPDATE!!!!!!!!!');

  var uid = req.session.userId;

  console.log(uid);
  
  if(!uid || !hid) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、ログアウトしました。',
      loginId: '',
      password: ''
    });
  }

  connection.query('UPDATE "hotelInfo" SET "delFlg" = $1 WHERE id = $2;', [1, hid], (error, response) => {
    if (error) {
      console.error('Update Error:' + error);
      res.render('error', {});
    } else {
      console.log('Update Success!!!');
      res.redirect('/complete/?comp=delHotel');
    }
    return;
  });
});

// ホテル情報取得
const getHotelReder = (res, uid, hid) => {
  connection.query('SELECT name, lat, lng, url, "fromBusTime", "toBusTime", "regHoliday", "reservationInfo", "userId" FROM hotelInfo WHERE id = $1 AND "delFlg" <> 1 LIMIT 1;', [hid], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success!!!');
      if(Object.keys(response.rows).length == 0) {
        res.redirect('/');
      } else {
        if(response.rows[0].userId != uid) {
          // セッションユーザIDがホテルインフォのユーザIDと違う場合、ホームに戻る
          res.redirect('/');
        } else {
          res.render('delHotel', {
            title: 'ホテル情報削除確認',
            name: response.rows[0].name,
            lat: response.rows[0].lat,
            lng: response.rows[0].lng,
            url: response.rows[0].url,
            fbTime: response.rows[0].fromBusTime,
            tbTime: response.rows[0].toBusTime,
            regHoliday: response.rows[0].regHoliday,
            resInfo: response.rows[0].reservationInfo
          });
        }
      }
    }
    return;
  });
}

module.exports = router;
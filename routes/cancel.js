var express = require('express');
var session = require('express-session');
var router = express.Router();

// Require mysqlConnection
// const connection = require('../public/javascripts/mysqlConnection');
const connection = require('../db/pool');

const com = require('../public/javascripts/commonCustom.js');

var rid = '';

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
  console.log('cancel初期表示処理開始');

  var uid = req.session.userId;
  if(uid == undefined) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }

  rid = '';

  if(req.url.indexOf('?') != -1) {
    // rid
    var ridPrm = req.url.split('?')[1].split('=')[0];
    if(ridPrm == 'rid') {
      rid = req.url.split('=')[1];
    }
    console.log('rid：' + rid);
  }

  // セッションチェックも兼ねて
  connection.query('SELECT "hotelName", "reserveDate", "reserveTime", "roomVal", "登録日時" FROM reserveInfo WHERE id = $1 AND "userId" = $2 AND "cancelFlg" <> 1 LIMIT 1;', [rid, uid], (error, response) => {
    if (error) {
      console.error('Insert Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success!!!');
      if(response.rows.length < 1) {
        // セッション情報と違う場合、ホームへ遷移
        console.log('ホームへ遷移...');
        res.redirect('/');
      } else {
        console.log('キャンセル画面へ遷移...');
        var jsonTime = JSON.parse(response.rows[0].reserveTime);
        res.render('cancel', {
          title: '予約キャンセル',
          hotelName: response.rows[0].hotelName,
          resDate: response.rows[0].reserveDate,
          fromTime: jsonTime.fromTime,
          toTime: jsonTime.toTime,
          roomVal: response.rows[0].roomVal,
          regDate: response.rows[0].登録日時,
        });
      }
      return;
    }
    return;
  });
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('CANCEL!');

  var uid = req.session.userId;

  if(uid == undefined) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }

  connection.query('UPDATE "reserveInfo" SET "cancelFlg" = $1 WHERE id = $2 AND "userId" = $3;', [1, rid, uid], (error, response) => {
    if (error) {
      console.error('Cancel Error:' + error);
      res.render('error', {});
    } else {
      console.log('Cancel Success!!!');
      res.redirect('/complete/?comp=cancel');
      return;
    }
    return;
  });
});

module.exports = router;
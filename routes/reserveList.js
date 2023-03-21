var express = require('express');
var session = require('express-session');
var router = express.Router();

// Require mysqlConnection
// const connection = require('../public/javascripts/mysqlConnection');
const connection = require('../db/pool');

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
  console.log('予約一覧初期表示処理開始');

  var uid = req.session.userId;

  if(uid == undefined) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }

  connection.query('SELECT id, "hotelName", "reserveDate", "reserveTime", "roomVal", "登録日時" FROM reserveInfo WHERE "userId" = $1 AND "cancelFlg" <> 1;', [uid], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success!!!');
      res.render('reserveList', {
        title: 'ホテル予約一覧',
        values: response.rows
      });
    }
    return;
  });
});

module.exports = router;
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
  console.log('登録ホテル一覧初期表示処理開始');

  var uid = req.session.userId;

  if(uid == undefined) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }

  connection.query('SELECT id, name FROM hotelInfo WHERE "userId" = $1 AND "delFlg" <> 1 ORDER BY id ASC;', [uid], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success!!!');
      res.render('hotelList', {
        title: 'ホテル一覧',
        values: response.rows
      });
    }
    return;
  });
});

module.exports = router;
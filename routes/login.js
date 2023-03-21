var express = require('express');
var session = require('express-session');
var router = express.Router();

// Require mysqlConnection
// const connection = require('../public/javascripts/mysqlConnection');
const connection = require('../db/pool');

const errMsg = 'ログインID、もしくはパスワードが違います。';

// セッション情報
router.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    secure: false,
    cookie:{
      httpOnly: true,
      secure: false,
      // 有効期限：30分
      maxAge: 1000 * 60 * 30
    }
  }
}));

/* GET index page. */
router.get('/', function (req, res, next) {
  console.log('login初期表示処理開始');
  // ログイン画面へ遷移
  res.render('login', {
    title: 'ログイン画面',
    error: '',
    loginId: '',
    password: ''
  });
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('LOGIN!!!!!!!!!');
  console.log(req.body.loginId);
  const loginId = req.body.loginId;
  const password = req.body.password;
  const loginDate = new Date();

  connection.query('SELECT id, "userId" FROM userInfo WHERE "loginId" = $1 AND "password" = $2;', [loginId, password], (error, response) => {
    if (error) {
      // selectエラー時
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success');
      var id = '';
      if(Object.keys(response.rows).length != 0) {
        id = response.rows[0].id;  
      }
      if (id) {
        // ID取得時（ログイン認証成功）
        console.log(id);
        const userId = loginId + '_' + id;
        // セッション情報をセット
        req.session.userId = userId;
        indexRender(res, userId, loginId, password, loginDate);
      } else {
        // ID取得失敗
        res.render('login', {
          title: 'ログイン画面',
          error: errMsg,
          loginId: loginId,
          password: password
        });
      }
    }
    return;
  });

  const indexRender = (res, userId, loginId, password, loginDate) => {
    connection.query('UPDATE userInfo SET "lastLoginDate" = $1, "userId" = $2 WHERE "loginId" = $3 AND "password" = $4;', [loginDate, userId, loginId, password], (error, response) => {
      if (error) {
        console.error('Update Error:' + error);
        res.render('error', {});
      } else {
        console.log('Update and Login Success');
        // ホームへ画面遷移
        res.redirect('/');
      }
      return;
    });
  }
});

module.exports = router;
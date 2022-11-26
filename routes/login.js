var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

const errMsg = 'ログインID、もしくはパスワードが違います。';

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

  connection.query('SELECT id, userId FROM userInfo WHERE loginId = ? AND password = ?;', [loginId, password], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success');
      var id = '';
      if(Object.keys(response).length != 0) {
        id = response[0].id;  
      }
      if (id) {
        console.log(id);
        const userId = loginId + '_' + id;
        indexRender(res, userId, loginId, password, loginDate);
      } else {
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
    connection.query('UPDATE userInfo SET lastLoginDate = ?, userId = ? WHERE loginId = ? AND password = ?;', [loginDate, userId, loginId, password], (error, response) => {
      if (error) {
        console.error('Update Error:' + error);
        res.render('error', {});
      } else {
        console.log('Update and Login Success');
        // ホームへ画面遷移
        res.writeHead(301, { Location: "/?uid=" + userId });
        res.end();
      }
      return;
    });
  }
});

module.exports = router;
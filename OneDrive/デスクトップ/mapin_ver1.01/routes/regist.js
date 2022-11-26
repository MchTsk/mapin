var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

const errMsg = '「パスワード」と「パスワード（確認用）」で入力したパスワードは同じ内容を入力してください。';
const errMsg2 = '登録済みのIDです。他のIDを入力してください。';

var uid = '';

/* GET index page. */
router.get('/', function (req, res, next) {
  if(req.url.indexOf('?') != -1) {
    // uid
    var uidPrm = req.url.split('?')[1].split('=')[0];
    if(uidPrm == 'uid') {
      uid = req.url.split('=')[1].split('&')[0];
    }
    console.log('uid：' + uid);
  }
  if(!uid) {
    res.render('regist', {
      title: '会員登録',
      error: '',
      userName: '',
      loginId: '',
      password: '',
      password2: ''
    });
  } else {
    // ホームへ画面遷移
    res.writeHead(301, { Location: "/?uid=" + uid });
    res.end();
  }
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('REGIST!!!!!!!!!');
  console.log(req.body.userName);
  const userName = req.body.userName;
  const loginId = req.body.loginId;
  const password = req.body.password;
  const password_2 = req.body.password_2;

  if (password != password_2) {
    console.error('Password mutch error.');
    res.render('regist', {
      title: '会員登録', 
      error: errMsg,
      userName: userName,
      loginId: loginId,
      password: password,
      password2: password_2
    });
  } else {
    idChecker(res, userName, loginId, password);
  }
});

const idChecker = (res, userName, loginId, password) => {
  connection.query('SELECT loginId FROM userInfo WHERE loginId = ?;', loginId, (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success');
      if (Object.keys(response).length != 0) {
        res.render('regist', {
          title: '会員登録', 
          error: errMsg2,
          userName: userName,
          loginId: loginId,
          password: password,
          password2: password
        });
      } else {
        compRender(res, userName, loginId, password);
      }
    }
    return;
  });
}

const compRender = (res, userName, loginId, password) => {
  connection.query('INSERT INTO userInfo(userName,loginId,password) VALUES(?,?,?);', [userName, loginId, password], (error, response) => {
    if (error) {
      console.error('Insert Error:' + error);
      res.render('error', {});
    } else {
      console.log('Insert Success');
      res.writeHead(301, { Location: "/complete" });
      res.end();
    }
    return;
  });
}

module.exports = router;
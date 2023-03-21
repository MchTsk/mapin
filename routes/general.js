var express = require('express');
var session = require('express-session');
var router = express.Router();

// Require mysqlConnection
// const connection = require('../public/javascripts/mysqlConnection');
const connection = require('../db/pool');

const com = require('../public/javascripts/commonCustom.js');

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

  console.log("会員登録画面遷移");

  var uid = req.session.userId;

  if(!uid) {
    res.render('general', {
      title: '会員登録',
      error: '',
      userName: '',
      loginId: '',
      password: '',
      password2: '',
      contact1: '',
      contact2: '',
      contact3: ''
    });
  } else {
    // ホームへ画面遷移
    res.redirect('/');
  }
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('REGIST!!!!!!!!!');

  var uid = req.session.userId;
  if(uid) {
    // ホームへ画面遷移
    res.redirect('/');
  }

  const userName = req.body.userName;
  const loginId = req.body.loginId;
  const password = req.body.password;
  const password_2 = req.body.password_2;
  const contact1 = req.body.contact1;
  const contact2 = req.body.contact2;
  const contact3 = req.body.contact3;

  if (password != password_2) {
    console.error('Password mutch error.');
    res.render('general', {
      title: '会員登録', 
      error: com.errMsg,
      userName: userName,
      loginId: loginId,
      password: '',
      password2: '',
      contact1: contact1,
      contact2: contact2,
      contact3: contact3
    });
  }

  com.idChecker(connection, loginId).then((val) => {
    if(val == 0) {
      res.render('general', {
        title: '会員登録', 
        error: com.errMsg2,
        userName: userName,
        loginId: loginId,
        password: '',
        password2: '',
        contact1: contact1,
        contact2: contact2,
        contact3: contact3
      });
    } else {
      const contact = contact1 + "-" + contact2 + "-" + contact3;
      com.compRender(connection, userName, loginId, password, contact, 'general').then(() => {
        res.redirect('/complete/?comp=genUser');
      }).catch((e) => {
        console.error(e);
        res.render('error', {});
      });
    }
  }).catch((e) => {
    console.error(e);
    res.render('error', {});
  });
});

module.exports = router;
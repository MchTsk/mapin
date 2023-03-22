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
  console.log('reserve初期表示処理開始');

  var uid = req.session.userId;
  var hid = req.session.hotelId;
  var json = req.session.jsonReserve;

  if(uid != undefined && hid == undefined) {
    res.redirect('/');
  } else if(uid == undefined && hid == undefined) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  } else if((uid == undefined) && (hid != undefined)) {
    res.render('login', {
      title: 'ログイン画面',
      error: 'ホテルを予約するにはログインが必要です。会員登録がまだの場合は会員登録を行ってください。',
      loginId: '',
      password: ''
    });
  } else if(json == undefined) {
    res.redirect('/');
  }

  // 連絡先を取得
  connection.query('SELECT "contact" FROM userInfo WHERE "userId" = $1 LIMIT 1;', [uid], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success(contact)');
      if (response.rows.length == 0) {
        req.session.userId = undefined;
        req.session.hotelId = undefined;
        req.session.jsonReserve = undefined;
        res.render('login', {
          title: 'ログイン画面',
          error: 'ユーザ情報が存在しません。ログインからやり直してください。',
          loginId: '',
          password: ''
        });
      } else {
        res.render('reserve', {
          title: '予約確認',
          timeId: json.timeId,
          userName: json.userName,
          contact: response.rows[0].contact,
          hotelName: json.hotelName,
          resDate: json.resDate,
          fromTime: json.fromTime,
          toTime: json.toTime,
          roomVal: json.roomVal
        });
      }
    }
    return;
  });
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('INSERT!!!!!!!!!');

  var uid = req.session.userId;
  var hid = req.session.hotelId;

  if((uid == undefined) || (hid == undefined)) {
    req.session.userId = undefined;
    req.session.hotelId = undefined;
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }

  const today = new Date();
  var jsonTime = {};
  const timeNum = Number(req.body.timeId);
  const userName = req.body.userName;
  const contact = req.body.contact;

  const hotelName = req.body.hotelName;
  const resDate = req.body.resDate;
  const roomVal = req.body.roomVal;
  console.log(resDate);

  jsonTime.fromTime = req.body.fromTime;
  jsonTime.toTime = req.body.toTime;
  const resTime = JSON.stringify(jsonTime);
  console.log(resTime);

  // hotelId TEXT, hotelName TEXT, userId TEXT, userName TEXT, reserveDate TEXT, reserveTime TEXT, roomVal TEXT, oldFlg TINYINT(1), cancelFlg TINYINT(1), 登録日時 DATETIME
  connection.query('INSERT INTO reserveInfo("hotelId", "hotelName", "userId", "userName", "contact", "reserveDate", "timeNum", "reserveTime", "roomVal", "oldFlg", "cancelFlg", "登録日時") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);', [hid, hotelName, uid, userName, contact, resDate, timeNum, resTime, roomVal, 0, 0, today], (error, response) => {
    if (error) {
      console.error('Insert Error:' + error);
      res.render('error', {});
    } else {
      console.log('Insert Success!!!');
      req.session.hotelId = undefined;
      req.session.jsonReserve = undefined;
      res.redirect('/complete/?comp=reserve');
      return;
    }
    return;
  });
});

module.exports = router;
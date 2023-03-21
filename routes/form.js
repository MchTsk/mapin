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
  console.log('form初期表示処理開始');

  var uid = req.session.userId;
  console.log("uid：" + uid);
  
  if(uid) {
    // 登録フォーム画面遷移処理へ
    res.render('form', {
      title: 'ホテル情報登録フォーム'
    });
  } else {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('INSERT!!!!!!!!!');

  var uid = req.session.userId;
  console.log("uid：" + uid);

  if(!uid) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }

  console.log(req.body.hotelName);

  const name = req.body.hotelName;
  const lat = req.body.latitude;
  const lng = req.body.longitude;
  const url = req.body.hpUrl;
  const fbTime = req.body.fbTime;
  const tbTime = req.body.tbTime;
  const rh = req.body.regHoliday;
  const ri = req.body.resInfo;

  connection.query('INSERT INTO hotelInfo(name,lat,lng,url,"fromBusTime","toBusTime","regHoliday","reservationInfo","userId","delFlg") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);', [name, lat, lng, url, fbTime, tbTime, rh, ri, uid, 0], (error, response) => {
    if (error) {
      console.error('Insert Error:' + error);
      res.render('error', {});
    } else {
      console.log('Insert Success');
      res.redirect('/complete/?comp=regHotel');
    }
    return;
  });
});

module.exports = router;
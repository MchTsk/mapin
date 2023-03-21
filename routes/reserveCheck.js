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
  console.log('ホテル予約状況確認初期表示処理開始');

  var uid = req.session.userId;

  var hid = '';
  if(req.url.indexOf('?') != -1) {
    // hid
    var hidPrm = req.url.split('?')[1].split('=')[0];
    if(hidPrm == 'hid') {
      hid = req.url.split('=')[1];
    }
    console.log('hid：' + hid);
  }

  if(uid == undefined) {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、自動的にログアウトされました。',
      loginId: '',
      password: ''
    });
  }

  // var date = new Date();
  // var yyyy = date.getFullYear();
  // var mm = String(date.getMonth() - 1);
  // if(mm.length == 1) {
  //   mm = 0 + mm;
  // }
  // var dd = String(date.getDate());
  // if(dd.length == 1) {
  //   dd = 0 + dd;
  // }
  // var dayOfWeek = date.getDay();
	// var dowStr = [ "（日）", "（月）", "（火）", "（水）", "（木）", "（金）", "（土）" ][dayOfWeek];

  // var resDate = String(yyyy + "/" + mm  + "/" + dd + dowStr);
  // console.log(resDate);

  connection.query('SELECT name, "regHoliday" FROM hotelInfo WHERE id = $1 AND "delFlg" <> 1;', [hid], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success!!!');
      var hotelName = response.rows[0].name;
      var regHoliday = response.rows[0].regHoliday;
      // connection.query('SELECT userName, reserveDate, reserveTime, roomVal, oldFlg, 登録日時 FROM reserveInfo WHERE hotelId = ? AND reserveDate = ? AND cancelFlg <> 1 ORDER BY timeNum ASC;', [hid, resDate], (error, response) => {
        connection.query('SELECT "userName", "contact", "reserveDate", "reserveTime", "roomVal", "oldFlg", "登録日時" FROM reserveInfo WHERE "hotelId" = $1 AND "cancelFlg" <> 1 ORDER BY "timeNum" ASC;', [hid], (error, response) => {
        if (error) {
          console.error('Read Error:' + error);
          res.render('error', {});
        } else {
          console.log('Read Success!!!!!!');
          res.render('reserveCheck', {
            title: '予約状況',
            hotelName: hotelName,
            regHoliday: regHoliday,
            values: response.rows
          });
        }
        return;
      });
    }
    return;
  });
});

module.exports = router;
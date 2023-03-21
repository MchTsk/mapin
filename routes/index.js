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
  console.log('home初期表示処理開始');
  var uid = req.session.userId;
  var page = '';
  
  console.log("sessionID：" + uid);
  console.log("sessionTime：" + req.session.cookie.maxAge);

  if(req.url.indexOf('?') != -1) {
    // パラメータ名称
    var uidName = req.url.split('?')[1].split('=')[0];
    if(uidName == 'page') {
      page = req.url.split('=')[1].split('&')[0];
      if(page == 'logout') {
        uid = undefined;
      }
    }
    console.log('page：' + page);
  }
  
  indexRender().then((hotelInfo) => {
    if(uid) {
      // セッション情報にuidが設定されている場合
      console.log('ログイン処理へ');
      getUnameRender(uid).then((userInfo) => {
        res.render('index', {
          title: 'HOME',
          values: hotelInfo,
          userName: userInfo[0].userName,
          userId: uid,
          role: userInfo[0].role
        });
      }).catch((e) => {
        console.error('Read Error:' + e);
        res.render('error', {});
      });
    } else {
      // URLにlogout(パラメータ値)が設定されている場合
      // セッション情報.ユーザID削除
      console.log('非ログイン or ログアウト処理へ');
      req.session.userId = undefined;
      res.render('index', {
        title: 'HOME',
        values: hotelInfo,
        userName: '',
        userId: '',
        role: ''
      });
    }
  }).catch((e) => {
    console.error('Read Error:' + e);
    res.render('error', {});
  });
});

// ホテル情報の詳細を取得
router.get('/get', function(req, res, next) {
  var hid = req.query.id;
  console.log('hid ：' + hid);
  var jsonData = {};

  connection.query('SELECT id, name, url, "regHoliday", "reservationInfo" FROM hotelInfo WHERE id = $1 LIMIT 1;', [hid], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success!!!：' + response.rows[0].id);
      var hotelInfo = response.rows;
      connection.query('SELECT id, "reserveDate", "reserveTime", "登録日時" FROM "reserveInfo" WHERE "hotelId" = $1 AND "cancelFlg" = 0 ORDER BY "登録日時" ASC;', [hid], (error, response) => {
        if (error) {
          console.error('Read Error:' + error);
          res.render('error', {});
        } else {
          // セッション情報を登録
          req.session.hotelId = undefined;
          req.session.hotelId = hid;
          var reserveInfo = response.rows;
          jsonData.hotelInfo = hotelInfo;
          jsonData.reserveInfo = reserveInfo;
          res.json(jsonData);
        }
        return;
      });
    }
    return;
  });
});

/* POST new todo. */
router.post('/', function (req, res, next) {

  const resDetail = req.body.resDetail;
  const json = JSON.parse(resDetail);

  req.session.jsonReserve = json;

  res.redirect('/reserve');
});

/* Render Function */
// ホテル情報取得
const indexRender = () => new Promise(function (resolve, reject) {
  connection.query('SELECT id, name, lat, lng, "userId", "fromBusTime", "toBusTime", "regHoliday" FROM hotelInfo WHERE "delFlg" <> 1 ORDER BY id ASC;', (error, response) => {
    if (error) {
      reject(error);
    } else {
      console.log('Read Success!!!');
      resolve(response.rows);
    }
    return;
  });
});

// ユーザ名取得
const getUnameRender = (uid) => new Promise(function (resolve, reject) {
  connection.query('SELECT "userName", role FROM userInfo WHERE "userId" = $1 LIMIT 1;', [uid], (error, response) => {
    if (error) {
      reject(error);
    } else {
      console.log('Read!!! Success!!!!!：' + response.rows[0].userName);
      resolve(response.rows);
    }
    return;
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

const com = require('../public/javascripts/commonCustom.js');

var uid = '';

var page = '';

var jUsersHotel = [];

/* GET index page. */
router.get('/', function (req, res, next) {
  console.log('home初期表示処理開始');
  uid = '';
  page = '';
  if(req.url.indexOf('?') != -1) {
    // uid
    var uidPrm = req.url.split('?')[1].split('=')[0];
    if(uidPrm == 'uid') {
      uid = req.url.split('=')[1].split('&')[0];
    } else if(uidPrm == 'page') {
      page = req.url.split('=')[1].split('&')[0];
    }
    console.log('uid：' + uid);
    console.log('page：' + page);
  }
  if(uid) {
    // 共通処理（セッションタイムアウト処理）
    com.sessionRender(connection, res, uid).then(() => {
      // ホテル情報取得処理へ
      indexRender(res);
    }).catch((e) => {
      // エラー
      console.log(e);
      res.render('error', {});
    })
  } else {
    indexRender(res);
  }
});

/* Render Function */
// ホテル情報取得
const indexRender = (res) => {
  connection.query('SELECT id, name, lat, lng, url, userId FROM hotelInfo WHERE delFlg <> 1 ORDER BY ID ASC;', (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
    } else {
      console.log('Read Success!!!');
      // URLにuidが設定されている かつ 取得したuserIdがURLのuidと一致している場合
      jUsersHotel = [];
      if(uid) {
        for (var i in response) {
          if(uid == response[i].userId) {
            jUsersHotel.push(response[i]);
          }
        }
        getUnameRender(res, response);
      } else if(page.split(':')[0] == 'logout') {
        updLastLoinDate(res, response);
      } else {
        res.render('index', {
          title: 'mapin',
          values: response,
          usersVal: jUsersHotel,
          userName: ''
        });
      }
    }
    return;
  });
}

// ユーザ名取得
const getUnameRender = (res, hotelInfo) => {
  connection.query('SELECT userName FROM userInfo WHERE userId = ? LIMIT 1;', uid, (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
    } else {
      console.log('Read!!! Success!!!!!：' + response[0].userName);
      res.render('index', {
        title: 'mapin',
        values: hotelInfo,
        usersVal: jUsersHotel,
        userName: response[0].userName
      });
    }
    return;
  });
}

// ログアウト時の最終ログイン日時更新
const updLastLoinDate = (res, hotelInfo) => {
  const today = new Date;
  const befDate = new Date(today.setDate(today.getDate() - 1));
  console.log(befDate);
  const outUid = page.split(':')[1];
  connection.query('UPDATE userInfo SET lastLoginDate = ? WHERE userId = ?;', [befDate, outUid], (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
    } else {
      console.log('Update!!! Success!!!!!：');
      res.render('index', {
        title: 'mapin',
        values: hotelInfo,
        usersVal: jUsersHotel,
        userName: ''
      });
    }
    return;
  });
}

module.exports = router;
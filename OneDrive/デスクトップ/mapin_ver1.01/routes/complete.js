var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

const com = require('../public/javascripts/commonCustom.js');

var uid = '';
var comp = '';

/* GET index page. */
router.get('/', function (req, res, next) {
  if(req.url.indexOf('?') != -1) {
    // uid
    var uidPrm = req.url.split('?')[1].split('=')[0];
    if(uidPrm == 'uid') {
      uid = req.url.split('=')[1].split('&')[0];
    }
    console.log('uid：' + uid);
    // comp
    var compPrm = req.url.split('&')[1].split('=')[0];
    if(compPrm == 'comp') {
      comp = req.url.split('=')[2];
    }
    console.log('comp：' + comp);
  }
  if(uid) {
    // 共通処理（セッションタイムアウト処理）
    com.sessionRender(connection, res, uid).then(() => {
      // 登録完了画面遷移処理へ
      if(comp == 'regHotel') {
        res.render('complete', {
          title: 'ホテル情報「登録」完了'
        });
      } else if(comp == 'updHotel') {
        res.render('complete', {
          title: 'ホテル情報「更新」完了'
        });
      } else if(comp == 'delHotel') {
        res.render('complete', {
          title: 'ホテル情報「削除」完了'
        });
      } else {
        res.render('error', {});
      }
    }).catch((e) => {
      // エラー
      console.log(e);
      res.render('error', {});
    })
  } else {
    res.render('complete', {
      title: '会員登録完了'
    });
  }
});

module.exports = router;
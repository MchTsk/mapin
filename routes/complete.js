var express = require('express');
var session = require('express-session');
var router = express.Router();

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

  var uid = req.session.userId;
  var comp = '';

  if(req.url.indexOf('?') != -1) {
    // comp
    var compPrm = req.url.split('?')[1].split('=')[0];
    if(compPrm == 'comp') {
      comp = req.url.split('=')[1];
    }
    console.log('comp：' + comp);
  }

  if(uid) {
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
    } else if(comp == 'reserve') {
      res.render('complete', {
        title: '予約完了'
      });
    } else if(comp == 'cancel') {
      res.render('complete', {
        title: 'キャンセル完了'
      });
    } else {
      res.redirect('/');
    }
  } else if(comp == 'regUser') {
    res.render('complete', {
      title: '法人登録完了'
    });
  } else if(comp == 'genUser') {
    res.render('complete', {
      title: '会員登録完了'
    });
  } else {
    res.render('login', {
      title: 'ログイン画面',
      error: '長時間操作が行われなかったため、ログアウトしました。',
      loginId: '',
      password: ''
    });
  }
});

module.exports = router;
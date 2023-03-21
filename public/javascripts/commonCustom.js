// --------------------------------------------↓共通メッセージ----------------------------------------------------------

exports.errMsg = '「パスワード」と「パスワード（確認用）」で入力したパスワードは同じ内容を入力してください。';
exports.errMsg2 = '登録済みのIDです。他のIDを入力してください。';

// --------------------------------------------↓共通サーバ処理----------------------------------------------------------

// セッションタイムアウト認証
exports.sessionRender = (con, res, uid) => new Promise(function (resolve, reject) {
	con.query('SELECT lastLoginDate FROM userInfo WHERE userId = $1 LIMIT 1;', uid, (error, response) => {
	  if (error) {
		console.error('Read Error:' + error);
		reject(error);
	  } else {
		// 最後にログインした日付
		const lld = response.rows[0].lastLoginDate;
		console.log('Read Success : ' + uid + '、日時：' + lld);
		// 当日
		const today = new Date();
		// 最後にログインした日付と比較する日付(当日より1日前の日付)を取得
		const bdate = new Date(today.setDate(today.getDate() - 1));
		// 最後にログインした日付より古い日付か比較
		console.log(lld);
		console.log(bdate);
		
		if(lld < bdate) {
			res.render('login', {
				title: 'ログイン画面',
				error: '長時間操作が行われなかったため、自動的にログアウトされました。',
				loginId: '',
				password: ''
			});
		}
		resolve();
	  }
	  return;
	});
});

// ログインIDが登録されているかの確認
exports.idChecker = (con, loginId) => new Promise(function (resolve, reject) {
	con.query('SELECT "loginId" FROM userInfo WHERE "loginId" = $1;', [loginId], (error, response) => {
		if (error) {
			console.error('Read Error:' + error);
			reject(error);
		} else {
			console.log('Read Success');
			if (Object.keys(response.rows).length != 0) {
				resolve(0);
			} else {
				resolve(1);
			}
		}
		return;
	});
});

// ユーザインフォへの登録処理
exports.compRender = (con, userName, loginId, password, contact, role) => new Promise(function (resolve, reject) {
	con.query('INSERT INTO userInfo("userName","loginId","password","contact","role") VALUES($1,$2,$3,$4,$5);', [userName, loginId, password, contact, role], (error, response) => {
	  if (error) {
		console.error('Insert Error:' + error);
		reject(error);
	  } else {
		console.log('Insert Success');
		resolve();
	  }
	  return;
	});
});


// --------------------------------------------↓共通フロント処理---------------------------------------------------------

// リンク設定
function linkSetting(linkList) {
	for(var i in linkList) {
		var link = document.getElementById(linkList[i]);
		var prm = location.search.split('?')[1];
		if(prm) {
			prm = prm.split('=')[0];
		}
		var pageName = linkList[i].split('_')[0];
		var pathName = location.pathname;
		var pagePath = '';
		var pageSearch = '';
		if(pageName != 'index' && pageName != 'logout') {
			pagePath = pageName + '/';
		}
		if(location.pathname.split('/')[1] != '') {
			pathName = location.pathname.split('/')[0] + '/';
		}
		if(pageName != 'logout' && prm == 'uid') {
			pageSearch = location.search.split('&')[0];
		} else if(pageName == 'logout'){
			pageSearch = '?page=logout';
		}
		var url = location.protocol + pathName + pagePath + pageSearch;
		link.setAttribute('href', url);
	}
}

// パラメータ削除
function delParams(param) {
	// URLを取得
	var url = new URL(window.location.href);
	// URLSearchParamsオブジェクトを取得
	var params = url.searchParams;
	// パラメータ削除
	params.delete(param);
	// アドレスバーのURLからGETパラメータを削除
	history.replaceState('', '', url.pathname);
}

// 数字のみを表示する
function outOnlyNum(elem) {
	var id = "#" + $(elem).attr('id');
	var num = $(id).val();
	var value = num.replace(/[^0-9]/g, '');
	$(id).val(value);
}

// セッションタイムアウト認証
exports.sessionRender = (con, res, uid) => new Promise(function (resolve, reject) {
	con.query('SELECT lastLoginDate FROM userInfo WHERE userId = ? LIMIT 1;', uid, (error, response) => {
	  if (error) {
		console.error('Read Error:' + error);
		reject(error);
	  } else {
		// 最後にログインした日付
		const lld = response[0].lastLoginDate;
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
				error: 'ログアウト済み、もしくは長時間操作が行われなかったため、自動的にログアウトされました。',
				loginId: '',
				password: ''
			});
		}
		resolve();
	  }
	  return;
	});
  });

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
			pageSearch = '?page=logout:' + location.search.split('=')[1];
		}
		var url = location.protocol + pathName + pagePath + pageSearch;
		link.setAttribute('href', url);
	}
}

window.onload = function() {
	var uid = location.search.split('=')[1];
	if(uid) {
		$('.regUser').show();
		$('.nonUser').hide();
	} else {
		$('.regUser').hide();
		$('.nonUser').show();
	}

	// 共通処理（リンク設定）
	linkSetting(['login_link', 'regist_link', 'form_link', 'index_link']);
}

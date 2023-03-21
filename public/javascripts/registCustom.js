window.onload = function() {
	
	// 数字のみを入力する
	$('.onlyNum').change(function() {
		outOnlyNum(this);
	});
	
	$('.check').change(function() {
		customCheck(this.name);
	});
}

//半角返還・入力チェック処理
function customCheck(fn) {

	//全角⇒半角返還（ログインID、パスワードのみ）
	var halfConArray = ["loginId", "password", "password_2"];
	if(halfConArray.indexOf(fn) != -1) {
		var nameSel = "input[name=" + fn + "]" ;
		var halfVal = halfConvert($(nameSel).val());
		$(nameSel).val(halfVal);
	}

	// 入力チェック
	var errFlg = false;
	$('.check').each(function(i, o){
		if( !($(o).val()) ) {
			errFlg = true;
		}
	});

	var loginId = $("input[name='loginId']").val();
	var password = $("input[name='password']").val();
	var password2 = $("input[name='password_2']").val();

	// 英数字 & 桁数チェック
	// 英数字ではない もしくは 8桁以上でない場合、errFlgをtrue
	// ログインID
	if(loginId && (!(loginId.match(/^[A-Za-z0-9]*$/)) || loginId.length < 8)){
		errFlg = true;
		$('#idErrArea').show();
	} else {
		$('#idErrArea').hide();
	}
	// パスワード
	if(password && (!(password.match(/^[A-Za-z0-9]*$/)) || password.length < 8)) {
		errFlg = true;
		$('#pwErrArea').show();
	} else {
		$('#pwErrArea').hide();
	}
	// パスワード（確認用）
	if(password2 && (!(password2.match(/^[A-Za-z0-9]*$/)) || password2.length < 8)) {
		errFlg = true;
		$('#pwErrArea_2').show();
	} else {
		$('#pwErrArea_2').hide();
	}

	// 送信ボタン活性表示処理
	if(errFlg) {
		$("button[type='submit']").attr('disabled', true);
	} else {
		$("button[type='submit']").attr('disabled', false);
	}

}

// 半角変換
function halfConvert(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９ ．]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

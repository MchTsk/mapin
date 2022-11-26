window.onload = function() {
	$('.check').change(function() {
		customCheck(this.name);
	});	

	// 共通処理（リンク設定）
	linkSetting(['index_link']);
}

//半角返還・入力チェック処理
function customCheck(fn) {

	//全角⇒半角返還（緯度、経度のみ）
	var halfConArray = ["latitude", "longitude"];
	if(halfConArray.indexOf(fn) != -1) {
		var nameSel = "input[name=" + fn + "]" ;
		var latlng = halfConvert($(nameSel).val());
		$(nameSel).val(latlng);
	}

	//入力チェック
	var errFlg = false;
	// ホテル名／緯度／経度のチェック
	$('.check').each(function(i, o){
		if( !($(o).val()) ) {
			errFlg = true;
		}
	});
	var url = $("textarea[name='hpUrl']").val();
	if(!url) {
		errFlg = true;
	}

	//小数チェック
	var lat = $("input[name='latitude']").val();
	var lng = $("input[name='longitude']").val();
	// 小数ではない場合errFlgをtrue
	//緯度
	if(lat && !(lat.match(/^[0-9]+\.[0-9]+$/))){
		errFlg = true;
		$('#latErrArea').show();
	} else {
		$('#latErrArea').hide();
	}
	//経度
	if(lng && !(lng.match(/^[0-9]+\.[0-9]+$/))) {
		errFlg = true;
		$('#lngErrArea').show();
	} else {
		$('#lngErrArea').hide();
	}

	//送信ボタン活性表示処理
	if(errFlg) {
		$("button[type='submit']").attr('disabled', true);
	} else {
		$("button[type='submit']").attr('disabled', false);
	}

}

//半角変換
function halfConvert(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９ ．]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

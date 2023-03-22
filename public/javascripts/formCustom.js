// 予約詳細の登録フォームを表示するためのHTML
var reserveListHtml = '<tr class="fadeUp2 formTimeTitle" id="resDetail_[0]"><td class="formYohaku"></td>'
						+ '<td class="formSubTitle2"><span id="timeTitle_[1]">時間[2]</span></td>'
						+ '<td class="formValue"><select class="check" id="fromTime_[3]"><option value="">-</option></select><span>～</span><select class="check" id="toTime_[4]"><option value="">-</option></select>'
						+ '<span class="detailTitle">部屋数</span><span class="detailForm"><input type="text" style="width: 40px" class="onlyNum check" id="roomNum_[5]" value=""></span>'
						+ '<span class="detailTitle">値段</span><span class="detailForm"><input type="text" style="width: 80px" class="onlyNum check" id="roomVal_[6]" value=""></span><span style="margin-left: 5px;">円</span>'
						+ '<input type="checkbox" class="detailTitle aboFlg" id="aboFlg_[7]" value="1"><label>一時廃止</label></td>'
						+ '<td><span><input class="delBtn" type="button" id="delBtn_[8]" value="削除"></span></td></tr>';

var deliteListHtml = '<tr class="fadeUp2 formTimeTitle" id="resDetail_[0]"><td class="formYohaku"></td>'
						+ '<td class="formSubTitle2">時間[1]</td>'
						+ '<td class="formValue"><input type="text" style="width: 40px" id="fromTime_[2]" value=""><span>～</span><input type="text" style="width: 40px" id="toTime_[3]" value="">'
						+ '<span class="detailTitle">部屋数</span><span class="detailForm"><input type="text" style="width: 40px" id="roomNum_[4]" value=""></span>'
						+ '<span class="detailTitle">値段</span><span class="detailForm"><input type="text" style="width: 80px" id="roomVal_[5]" value=""></span><span style="margin-left: 5px;">円</span>'
						+ '<input type="checkbox" style="margin-left: 50px;" class="aboFlg" id="aboFlg_[6]" value="1"><label>一時廃止</label></td></tr>';

// 予約詳細のカウント数
var counter = 0;

window.onload = function() {

	// counterをリセット
	counter = 0;

	// 特定の画面の処理
	if(location.pathname != '/delHotel/') {
		// 営業時間の選択肢を設定
		timeSelectSettng('#fromTime');
		timeSelectSettng('#toTime');
	}
	
	if(location.pathname == '/updHotel/') {
		// 予約詳細を１枠増やす
		incResDetail('#resDetailTitle');
		// updHotel画面用の処理
		updHotelProcess();
	} else if(location.pathname == '/delHotel/') {
		// 予約詳細を１枠増やす
		incResDetail('#resDetailTitle');
		// delHotel画面用の処理
		delHotelProcess();
	} else {
		// elseの場合は/form/
		// 予約詳細を１枠増やす
		incResDetail('#resDetailTitle');
	}

	// 予約詳細枠を増やす
	$('#incRes').click(function() {
		incResDetail('#resDetail_' + counter);
		$("button[type='submit']").attr('disabled', true);
	});

	// 登録ボタン押下時
	$('#btnRegist').click(function() {
		
		// 定休日のチェック値を取得
		var dateList = [];
		$('input:checked').each(function() {
			var className = $(this).attr("class");
			if(className == 'holiday') {
				dateList.push($(this).val());
			}
		})
		$('input[name="regHoliday"]').val(dateList);

		// 予約詳細枠の値を取得
		var jsonList = [];
		for(var i = 0; i < counter; i++) {
			var jsonResForm = {};
			var index = i + 1;
			jsonResForm.fromTime = $('#fromTime_' + index).val();
			jsonResForm.toTime = $('#toTime_' + index).val();
			jsonResForm.roomNum = $('#roomNum_' + index).val();
			jsonResForm.roomVal = $('#roomVal_' + index).val();
			var aboFlg = $('#aboFlg_' + index).prop("checked");
			if(aboFlg) {
				jsonResForm.aboFlg = '1';
			} else {
				jsonResForm.aboFlg = '0';
			}
			jsonList.push(jsonResForm);
		}
		$('input[name="resInfo"]').val(JSON.stringify(jsonList));
	});
}

// 各種イベント処理
$(function() {

	// 数字のみを入力する
	$(document).on("change", ".onlyNum", function(){
		outOnlyNum(this);
	});

	// 入力チェック
	$(document).on("change", ".check", function(){
		customCheck(this.name);
	});

	// 一時廃止制御
	$(document).on("click", ".aboFlg", function(){
		var id = $(this).attr('id');
		var num = Number(id.split('_')[1]);
		
		var aboFlg = $('#aboFlg_' + num).prop("checked");
		if(aboFlg) {
			$('#fromTime_' + num).prop('disabled', true);
			$('#toTime_' + num).prop('disabled', true);
			$('#roomNum_' + num).prop('disabled', true);
			$('#roomVal_' + num).prop('disabled', true);
		} else {
			$('#fromTime_' + num).prop('disabled', false);
			$('#toTime_' + num).prop('disabled', false);
			$('#roomNum_' + num).prop('disabled', false);
			$('#roomVal_' + num).prop('disabled', false);
		}
	});

	// 予約枠を削除
	$(document).on("click", ".delBtn", function(){
		// セレクタ情報を取得し、メッセージを設定
		var id = $(this).attr('id');
		var num = Number(id.split('_')[1]);
		var msg = "時間" + num + "を削除します。よろしいですか？";

		var check = confirm(msg);
		// 「OK」をクリックした際の処理
		if (check) {
			$('#resDetail_' + num).remove();

			var incNum = num + 1;
			for(var i = incNum; i < counter + 1; i++) {
				var decNum = i - 1;
				$('#resDetail_' + i).attr('id', 'resDetail_' + decNum);
				$('#timeTitle_' + i).text('時間' + decNum);
				$('#timeTitle_' + i).attr('id', 'timeTitle_' + decNum);
				$('#fromTime_' + i).attr('id', 'fromTime_' + decNum);
				$('#toTime_' + i).attr('id', 'toTime_' + decNum);
				$('#roomNum_' + i).attr('id', 'roomNum_' + decNum);
				$('#roomVal_' + i).attr('id', 'roomVal_' + decNum);
				$('#aboFlg_' + i).attr('id', 'aboFlg_' + decNum);
				$('#delBtn_' + i).attr('id', 'delBtn_' + decNum);
			}

			counter--;

			if(counter < 2) {
				$('#delBtn_1').prop('disabled', true);
			} else {
				$('#delBtn_1').prop('disabled', false);
			}

			// --------------------------------------------------------------------------------------
			// 削除時の入力チェック（増やした後にすぐ削除すると登録ボタンが表示されないなどの問題があるため）
			// --------------------------------------------------------------------------------------
			var errFlg = false;
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
			}
			//経度
			if(lng && !(lng.match(/^[0-9]+\.[0-9]+$/))) {
				errFlg = true;
			}

			if(errFlg) {
				$("button[type='submit']").attr('disabled', true);
			} else {
				$("button[type='submit']").attr('disabled', false);
			}

		} else {
			// 「キャンセル」をクリックした際、何も起きない
			return false;
		}
	});
});

// updHotel画面用処理
function updHotelProcess() {

	// 営業時間に時間をセット
	var fbTime = $('#hFbTime').val();
	var tbTime = $('#hTbTime').val();

	$('#hFbTime').val('');
	$('#hTbTime').val('');

	$('#fromTime').val(fbTime);
	$('#toTime').val(tbTime);

	// 定休日チェックボックスにチェックを入れる
	var rhListStr = $('input[name="regHoliday"]').val();
	var riListStr = $('input[name="resInfo"]').val();

	var rhList = rhListStr.split(",");
	for(var i in rhList) {
		$('#day_' + rhList[i]).prop('checked', true);
	}
	
	// 予約詳細枠の値を設定
	var riList = JSON.parse(riListStr);
	for(var k in riList) {
		if(k > 0) {
			incResDetail('#resDetail_' + counter);	
		}
		$('#fromTime_' + counter).val(riList[k].fromTime);
		$('#toTime_' + counter).val(riList[k].toTime);
		$('#roomNum_' + counter).val(riList[k].roomNum);
		$('#roomVal_' + counter).val(riList[k].roomVal);
		if(riList[k].aboFlg == '1') {
			$('#aboFlg_' + counter).prop('checked', true);
			$('#fromTime_' + counter).prop('disabled', true);
			$('#toTime_' + counter).prop('disabled', true);
			$('#roomNum_' + counter).prop('disabled', true);
			$('#roomVal_' + counter).prop('disabled', true);
		}
	}
}

// delHotel画面用処理
function delHotelProcess() {
	var rhListStr = $('input[name="regHoliday"]').val();
	var riListStr = $('input[name="resInfo"]').val();

	// 定休日に曜日の値を設定
	var rhList = rhListStr.split(",");
	var rhJpnList = [];
	for(var i in rhList) {
		if(rhList[i] == '0') {
			rhJpnList.push('日曜日');
		} else if(rhList[i] == '1') {
			rhJpnList.push('月曜日');
		} else if(rhList[i] == '2') {
			rhJpnList.push('火曜日');
		} else if(rhList[i] == '3') {
			rhJpnList.push('水曜日');
		} else if(rhList[i] == '4') {
			rhJpnList.push('木曜日');
		} else if(rhList[i] == '5') {
			rhJpnList.push('金曜日');
		} else if(rhList[i] == '6') {
			rhJpnList.push('土曜日');
		}
	}
	$('input[name="regHoliday"]').val(rhJpnList);
	
	// 予約詳細枠の値を設定
	var riList = JSON.parse(riListStr);
	for(var k in riList) {
		if(k > 0) {
			incResDetail('#resDetail_' + counter);	
		}
		$('#fromTime_' + counter).val(riList[k].fromTime);
		$('#toTime_' + counter).val(riList[k].toTime);
		$('#roomNum_' + counter).val(riList[k].roomNum);
		$('#roomVal_' + counter).val(riList[k].roomVal);
		
		$('#fromTime_' + counter).prop('disabled', true);
		$('#toTime_' + counter).prop('disabled', true);
		$('#roomNum_' + counter).prop('disabled', true);
		$('#roomVal_' + counter).prop('disabled', true);
		$('#aboFlg_' + counter).prop('disabled', true);

		if(riList[k].aboFlg == '1') {
			$('#aboFlg_' + counter).prop('checked', true);
		}
	}
}

// 予約詳細情報を増やす
function incResDetail(id) {
	counter++;
	var resHtml = '';
	// delHotelの場合のみ別のHTMLを使用
	if(location.pathname == '/delHotel/') {
		resHtml = deliteListHtml;
	} else {
		resHtml = reserveListHtml;
	}
	// 予約詳細枠のidに「_"番号"」を設定
	for(var i = 0; i < 9; i++) {
		resHtml = resHtml.replace('[' + i + ']', counter);
	}
	// 予約詳細枠を追加
	$(id).after(resHtml);
	
	if(location.pathname != '/delHotel/') {
		var fromId = '#fromTime_' + counter;
		var toId = '#toTime_' + counter;
		// 時間のセレクトボックスを設定
		timeSelectSettng(fromId);
		timeSelectSettng(toId);
	}

	if(counter < 2) {
		$('#delBtn_1').prop('disabled', true);
	} else {
		$('#delBtn_1').prop('disabled', false);
	}
}

// 時間のセレクトボックスを設定
function timeSelectSettng(id) {
	for(var i = 0; i < 24; i++) {
		var hh = i;
		if(i < 10) {
			hh = '0' + i;
		}
		var mmList = ['00', '15', '30', '45'];
		for(var k in mmList) {
			var option = $('<option>')
      			.text(hh + ':' + mmList[k])
      			.val(hh + ':' + mmList[k]);
			// 時間を設定
			$(id).append(option);
		}
	}
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

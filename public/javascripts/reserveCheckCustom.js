// グローバル変数（ホテル予約状況情報）
var reserveList = [];

window.onload = function() {
	reserveList = JSON.parse($('#resDetail').val());
	$('#resDetail').val('');
	
	// 予約日の設定（当日～７日）
	var date = new Date();
	for(var day = 0; day < 7; day++) {
		if(day > 0) {
			date.setDate(date.getDate() + 1);
		}
		var yyyy = String(date.getFullYear());
		var mm = String(date.getMonth() + 1);
		if(mm.length == 1) {
			mm = '0' + mm;
		}
		var dd = String(date.getDate());
		if(dd.length == 1) {
			dd = '0' + dd;
		}
		var dayOfWeek = date.getDay();
		var dowStr = [ "（日）", "（月）", "（火）", "（水）", "（木）", "（金）", "（土）" ][dayOfWeek];
		var option = $('<option>')
			  .text(yyyy + "/" + mm + "/" + dd + dowStr)
			  .val(dayOfWeek);
		// 時間を設定
		$('#resDate').append(option);
	}

	dispResHotelDetail();
}

// 各種イベント処理
$(function() {
	// 予約希望日を変更時
	$(document).on("change", "#resDate", function(){
		dispResHotelDetail();
	});
});

// ホテル予約詳細の表示制御
function dispResHotelDetail() {

	// 予約詳細枠、もしくは定休日メッセージを削除
	$('.resHotelList').remove();
	$('#holidayMsg').remove();

	var rhStr = $('#regHoliday').val();
	var rhList = rhStr.split(",");
	var resDateVal = $('#resDate').val();
	
	// 定休日の場合はメッセージを表示
	if (rhList.includes(resDateVal)) {
		var hHtml = '<tr id="holidayMsg">'
			+ '<td class="formYohaku"></td>'
			+ '<td colspan="6"><span class="errMsg">定休日です。予約情報が存在する場合、必要に応じて利用者に連絡してください。</span></td>'
			+ '</tr>';
		$('#reserveDate').after(hHtml);
	}

	var resInfo = [];
	for(var n in reserveList) {
		var resDate = reserveList[n].reserveDate;
		var selDate = $('#resDate option:selected').text();
		if(resDate == selDate) {
			resInfo.push(reserveList[n]);
		}
	}

	if(resInfo.length < 1) {
		var blankMsg = '<tr class="resHotelList fadeUp4">'
			+ '<td class="formYohaku"></td>'
			+ '<td colspan="6"><span>予約情報が存在しません。</span></td>'
			+ '</tr>';
		$('#resHotelbody').append(blankMsg);
	} else {
		// userName, reserveDate, reserveTime, roomVal, oldFlg, 登録日時
		for(var i in resInfo) {
			var index = Number(i) + 1;
			var userName = resInfo[i].userName;
			var contact = resInfo[i].contact;
			var reserveDate = resInfo[i].reserveDate;
			
			var jsonTime = JSON.parse(resInfo[i].reserveTime);
			var fromTime = jsonTime.fromTime;
			var toTime = jsonTime.toTime;

			var roomVal = resInfo[i].roomVal;
			// var oldFlg = resInfo[i].oldFlg;
			// var newMsg = '';
			// if(oldFlg == '0') {
			// 	newMsg = "<td><span class='errMsg'>New!!</span></td>";
			// }

			var date = new Date(resInfo[i].登録日時);
			var yyyy = String(date.getFullYear());
			var mm = String(date.getMonth() + 1).length == 1 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1);
			var dd = String(date.getDate()).length == 1 ? "0" + String(date.getDate()) : String(date.getDate());
			var hour = String(date.getHours()).length == 1 ? "0" + String(date.getHours()) : String(date.getHours());
			var min = String(date.getMinutes()).length == 1 ? "0" + String(date.getMinutes()) : String(date.getMinutes());
			var sec = String(date.getSeconds()).length == 1 ? "0" + String(date.getSeconds()) : String(date.getSeconds());
			var regDate = yyyy + "/" + mm + "/" + dd + " " + hour + ":" + min + ":" + sec;

			var dHtml = '<tr class="resHotelList fadeUp4" id="resHotelList_' + index + '">'
				+ '<td class="formYohaku"></td>'
				+ '<td><span>' + index + '</span></td>'
				+ '<td><span>' + userName + ' 様</span></td>'
				+ '<td><span>' + contact + '</span></td>'
				+ '<td><span>' + reserveDate + '</span></td>'
				+ '<td><span>' + fromTime + " ～ " + toTime + '</span></td>'
				+ '<td><span>' + roomVal + '</span> 円 </td>'
				+ '<td><span>' + regDate + '</span></td>'
				+ '</tr>';
			
			$('#resHotelbody').append(dHtml);
		}
	}
}

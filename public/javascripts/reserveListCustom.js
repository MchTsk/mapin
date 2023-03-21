window.onload = function() {

	dispResHotelDetail();

}

// 各種イベント処理
$(function() {
	
});

// ホテル予約詳細の表示制御
function dispResHotelDetail() {

	var blankMsg = '<tr class="resHotelList">'
		+ '<td colspan="6"><span>予約情報が存在しません。</span></td>'
		+ '</tr>';

	var reserveList = JSON.parse($('#resDetail').val());
	$('#resDetail').val('');

	if(reserveList.length < 1) {
		$('#resHotelbody').append(blankMsg);
	} else {
		var counter = 0;
		for(var i in reserveList) {

			var index = Number(i) + 1;
			var rid = reserveList[i].id;
			var hotelName = reserveList[i].hotelName;
			var reserveDate = reserveList[i].reserveDate;
			
			var jsonTime = JSON.parse(reserveList[i].reserveTime);
			var fromTime = jsonTime.fromTime;
			var toTime = jsonTime.toTime;

			var roomVal = reserveList[i].roomVal;

			var date = new Date(reserveList[i].登録日時);
			var yyyy = String(date.getFullYear());
			var mm = String(date.getMonth() + 1).length == 1 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1);
			var dd = String(date.getDate()).length == 1 ? "0" + String(date.getDate()) : String(date.getDate());
			var hour = String(date.getHours()).length == 1 ? "0" + String(date.getHours()) : String(date.getHours());
			var min = String(date.getMinutes()).length == 1 ? "0" + String(date.getMinutes()) : String(date.getMinutes());
			var sec = String(date.getSeconds()).length == 1 ? "0" + String(date.getSeconds()) : String(date.getSeconds());
			var regDate = yyyy + "/" + mm + "/" + dd + " " + hour + ":" + min + ":" + sec;

			var date = new Date();
			var dateStr = reserveDate.split('（')[0];
			var yyyy = Number(dateStr.split('/')[0]);
			var mm = Number(dateStr.split('/')[1].split('/')[0]);
			var dd = Number(dateStr.split('/')[2]);
			var hour = Number(toTime.split(':')[0]);
			var min = Number(toTime.split(':')[1]);

			var toDate = new Date(yyyy, mm - 1, dd, hour, min, 0);
			
			if(date <= toDate) {

				counter++;

				var dHtml = '<tr class="resHotelList" id="resHotelList_' + counter + '">'
					+ '<td class="formValue"><span>' + counter + '</span></td>'
					+ '<td class="formValue"><span>' + hotelName + '</span></td>'
					+ '<td class="formValue"><span>' + reserveDate + '</span></td>'
					+ '<td class="formValue"><span>' + fromTime + " ～ " + toTime + '</span></td>'
					+ '<td class="formValue"><span>' + roomVal + '</span> 円 </td>'
					+ '<td class="formValue"><span>' + regDate + '</span></td>'
					+ '<td><input type="button" class="btnCancel" onclick="location.href=[0]" value="キャンセル"></td>'
					+ '</tr>';
				
				dHtml = dHtml.replace('[0]', "'" + location.protocol + "//" + location.host + "/cancel/?rid=" + rid + "'");
				
				$('#resHotelbody').append(dHtml);
			}

			if(index == reserveList.length && counter == 0) {
				$('#resHotelbody').append(blankMsg);
			}
		}
	}
}

// 会員が登録したホテルの一覧を表示するためのHTML
var tempHtml = '<tr class="fadeUp2"><td>ホテルの登録情報が存在しません。</td></tr>';

var tempListHtml = '<tr class="fadeUp2" id="hotelTr_[0]"><th class="formSubTitle" style="padding-inline: 70px">[1]</th>' 
					+ '<td><button type="button" class="btnConfirm" onclick="location.href=[2]">予約状況</button></td>'
					+ '<td><button type="button" class="btnEdit" onclick="location.href=[3]">編集</button></td>'
					+ '<td><button type="button" class="btnDelete" onclick="location.href=[4]">削除</button></td></tr>';

// グローバル変数（ホテル予約詳細情報）
var hotelInfo = {};

// グローバル変数（ホテル予約状況情報）
var reserveInfo = [];

window.onload = function() {
	var jUsersHotel = JSON.parse($('#registHotelInfo').text());

	if(jUsersHotel.length == 0) {
		$('#uHotelTbody').append(tempHtml);
	} else {
		for (var i in jUsersHotel) {
			var listHtml = tempListHtml;
			var hid = jUsersHotel[i].id;
			var hnm = jUsersHotel[i].name;
			listHtml = listHtml.replace('[0]', hid);
			listHtml = listHtml.replace('[1]', hnm);
			listHtml = listHtml.replace('[2]', "'" + location.protocol + '//' + location.host + '/reserveCheck/?hid=' + hid + "'");
			listHtml = listHtml.replace('[3]', "'" + location.protocol + '//' + location.host + '/updHotel/?hid=' + hid + "'");
			listHtml = listHtml.replace('[4]', "'" + location.protocol + '//' + location.host + '/delHotel/?hid=' + hid + "'");
			$('#uHotelTbody').append(listHtml);
		}
	}
}

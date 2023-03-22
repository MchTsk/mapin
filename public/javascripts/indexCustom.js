// 会員が登録したホテルの一覧を表示するためのHTML
var tempListHtml = '<tr id="hotelTr_[0]"><th>[1]</th><td class="listMgr"></td><td style="text-align: right;"><a href="[2]">編集</a></td><td style="text-align: right;"><a href="[3]">削除</a></td></tr>';

// グローバル変数（ホテル予約詳細情報）
var hotelInfo = {};

// グローバル変数（ホテル予約状況情報）
var reserveInfo = [];

// グローバル変数（権限）
var role = '';

window.onload = function() {
	
	var prm = location.search.split('?')[1];
	var prmName = '';
	role = '';
	if(prm) {
		prmName = prm.split('=')[0];
	}

	// セッション情報.ユーザIDが存在する場合、ログイン状態にする
	var userId = $('#usrid').text();
	var userRl = $('#role').text();
	$('#usrid').text('');
	$('#role').text('');
	if(userId) {
		prmName = 'uid';
	}
	if(userId) {
		role = userRl;
	}

	// ログイン・非ログイン時の表示制御
	if(prmName == 'uid') {
		$('.nonUser').hide();
		$('.outUser').hide();
		if(role == 'regist') {
			$('.genUser').hide();
			$('.regUser').show();
		} else if(role == 'general') {
			$('.regUser').hide();
			$('.genUser').show();
		}
	} else {
		if(prmName == 'page') {
			$('.outUser').show();
		} else {
			$('.outUser').hide();
		}
		$('.regUser').hide();
		$('.genUser').hide();
		$('.nonUser').show();
	}

	// 共通処理（リンク設定）
	// linkSetting(['general_link', 'regist_link', 'login_link', 'form_link', 'logout_link', 'hotelList_link', 'reserveList_link']);

	// URLのパラメータ削除（common）
	delParams('uid');
}

// 各種イベント処理
$(function() {
	// マップのリンク(div)押下時
	$(document).on("click", ".detailDisp", function(){
	// $(document).on("click", "#btn", function(){
		var num = $(this).attr('value');
		// var num = '88';
		$('#resHotelDetail').hide();

		// セレクトボックスの子要素を削除
		$('#resDate').children().remove();

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

		// 予約詳細、予約状況情報を取得し、予約詳細エリアを表示
		$.getJSON("/get?id=" + num, function (jsonData) {
			// グローバル変数を空に設定
			hotelInfo = {};
			reserveInfo = [];
			// グローバル変数に格納
			hotelInfo = jsonData.hotelInfo[0];
			reserveInfo = jsonData.reserveInfo;

			$('#hotelName').text(hotelInfo.name);
			$('#exLink').attr("href", hotelInfo.url);

			dispResHotelDetail();

			$('#resHotelDetail').show();

			// 自動スクロール
			$(window).scrollTop($('#resHotelDetail').position().top);
		})
	});

	// 予約希望日を変更時
	$(document).on("change", "#resDate", function(){
		// 予約確認ボタンの表示制御
		$('#btnResCheck').attr('disabled', true);
		dispResHotelDetail();
	});

	// 選択押下時
	$(document).on("click", ".resPoint", function(){
		if($('.resPoint:checked').length == 0) {
			// 予約確認ボタンの表示制御
			$('#btnResCheck').attr('disabled', true);
			
			// 色を元に戻す
			$('.tableIndex').css('background-color', '#EEEEEE');
			$('.tableResDate').css('background-color', '#EEEEEE');
			$('.tableResTime').css('background-color', '#EEEEEE');
			$('.tableRoomVal').css('background-color', '#EEEEEE');
			$('.tableRoomNum').css('background-color', '#EEEEEE');
		} else {
			// ラジオボタン制御
			$('.resPoint:checked').prop('checked', false);
			$(this).prop('checked', true);
			// 予約確認ボタンの表示制御
			$('#btnResCheck').attr('disabled', false);

			// 色を元に戻す
			$('.tableIndex').css('background-color', '#EEEEEE');
			$('.tableResDate').css('background-color', '#EEEEEE');
			$('.tableResTime').css('background-color', '#EEEEEE');
			$('.tableRoomVal').css('background-color', '#EEEEEE');
			$('.tableRoomNum').css('background-color', '#EEEEEE');

			// 色をつける
			var id = $(this).attr('id');
			var index = id.split('_')[1];
			$('#tableIndex_' + index).css('background-color', '#aff6ff');
			$('#tableResDate_' + index).css('background-color', '#aff6ff');
			$('#tableResTime_' + index).css('background-color', '#aff6ff');
			$('#tableRoomVal_' + index).css('background-color', '#aff6ff');
			$('#tableRoomNum_' + index).css('background-color', '#aff6ff');
		}
	});

	// 予約確認押下時
	$('#btnResCheck').click(function() {
		var resJson = {};
		var id = $('.resPoint:checked').attr('id');
		var timeId = id.split("_")[1];
		resJson.timeNum = timeId;
		resJson.userName = $('#userName').text();
		resJson.hotelName = $('#hotelName').text();
		resJson.resDate = $('#resDate option:selected').text();
		resJson.fromTime = $('#fromTime_' + timeId).text();
		resJson.toTime = $('#toTime_' + timeId).text();
		resJson.roomVal = $('#roomVal_' + timeId).text();
		$('input[name="resDetail"]').val(JSON.stringify(resJson));
	});
});

// ホテル予約詳細の表示制御
function dispResHotelDetail() {

	// 予約詳細枠、もしくは定休日メッセージを削除
	$('.resHotelList').remove();
	$('#holidayMsg').remove();


	var rhStr = hotelInfo.regHoliday;
	var rhList = rhStr ? rhStr.split(",") : [];
	var resDateVal = $('#resDate').val();
	// 定休日の場合はメッセージのみ表示
	if (rhList.includes(resDateVal)) {
		var hHtml = '<tr id="holidayMsg" class="fadeHotelList">'
			+ '<td class="tableYohaku"></td>'
			+ '<td colspan="6"><span class="errMsg">定休日です。別の日付を選択してください。</span></td>'
			+ '</tr>';
		$('#resHotelListTitle').after(hHtml);
	} else {
		var resDetail = JSON.parse(hotelInfo.reservationInfo);
		var index = 0;
		for(var i in resDetail) {

			if(resDetail[i].aboFlg == '0') {
				index++;
				var resDate = $('#resDate option:selected').text();

				var fromTime = resDetail[i].fromTime;
				var toTime = resDetail[i].toTime;
				var roomVal = resDetail[i].roomVal;
				var roomNum = resDetail[i].roomNum;

				for(var j in reserveInfo) {
					var jsonTime = JSON.parse(reserveInfo[j].reserveTime);
					var jsonDate = reserveInfo[j].reserveDate;
					if(resDate == jsonDate) {
						if((jsonTime.fromTime == fromTime) && (jsonTime.toTime == toTime)) {
							roomNum = Number(roomNum) - 1;
						}
					}
				}

				var dHtml = '<tr class="resHotelList fadeHotelList" id="resHotelList_' + index + '">'
					+ '<td class="tableYohaku"></td>'
					+ '<td class="tableIndex" id="tableIndex_' + index + '"><div>' + index + '</div></td>'
					+ '<td class="tableResDate" id="tableResDate_' + index + '"><span class="resPreDate">' + resDate + '</span></td>'
					+ '<td class="tableResTime" id="tableResTime_' + index + '"><span id="fromTime_' + index + '">[0]</span> ～ <span id="toTime_' + index + '">[1]</span></td>'
					+ '<td class="tableRoomVal" id="tableRoomVal_' + index + '"><span id="roomVal_' + index + '">[2]</span> 円 </td>'
					+ '<td class="tableRoomNum" id="tableRoomNum_' + index + '"><span id="roomNum_' + index + '">[3]</span></td>'
					+ '<td class="tableResPoint"><input type="checkbox" class="resPoint genUser2 nonUser2" id="resPoint_' + index + '"></td>'
					+ '</tr>';

				// 時間外チェック
				var date = new Date();
				var todayNum = date.getDay()
				var weekNum = $('#resDate option:selected').val();
				if(todayNum == weekNum) {
					var nowTime = date.getTime();
					var startDate = new Date();
					startDate.setHours(Number(fromTime.split(':')[0]));
					startDate.setMinutes(Number(fromTime.split(':')[1]));
					startDate.setMinutes(startDate.getMinutes() - 15);
					var startTime = startDate.getTime();

					if(nowTime >= startTime) {
						roomNum = "時間外";
					}
				}

				var repList = [fromTime, toTime, roomVal, roomNum];
				for(var k in repList) {
					dHtml = dHtml.replace('[' + k + ']', repList[k]);
				}

				// HTMLをセット
				if(index == 1) {
					$('#resHotelListTitle').after(dHtml);
				} else {
					var bIndex = index - 1;
					$('#resHotelList_' + bIndex).after(dHtml);
				}

				// 詳細枠背景色設定
				$('.tableIndex').css('background-color', '#EEEEEE');
				$('.tableResDate').css('background-color', '#EEEEEE');
				$('.tableResTime').css('background-color', '#EEEEEE');
				$('.tableRoomVal').css('background-color', '#EEEEEE');
				$('.tableRoomNum').css('background-color', '#EEEEEE');

				// 残り部屋数が0なら非活性
				if(roomNum == 0 || roomNum == "時間外") {
					$('#resPoint_' + index).attr('disabled', true);
				}
			}
		}

		// indexが0（予約枠がない場合）
		if(index == 0) {
			var zHtml = '<tr class="resHotelList fadeHotelList">'
					+ '<td class="tableYohaku"></td>'
					+ '<td colspan="6"><span class="errMsg">予約枠がありません。別のホテルを選択してください。</span></td>'
					+ '</tr>';
			$('#resHotelListTitle').after(zHtml);
		}
	}

	if(role == 'regist') {
		$('#copMsg').text('法人ユーザでログイン中のため、予約は実行できません。');
		$('.genUser2').hide();
		$('.regUser2').show();
	} else if(role == 'general') {
		$('.regUser2').hide();
		$('.genUser2').show();
	} else {
		$('.regUser2').hide();
		$('.nonUser2').show();
	}
}

function clickSearch(type) {
	$('#resHotelDetail').hide();
	$('#map').show();
	if(type == "current") {
		currentSearch();
	}
}

function currentSearch() {
	// Geolocation APIに対応している
	if (navigator.geolocation) {
        // 現在地を取得
        navigator.geolocation.getCurrentPosition(
          	// 取得成功した場合
          	function(position) {
            	// 緯度・経度を変数に格納
            	var mapLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            	// マップオプションを変数に格納
            	var mapOptions = {
              		zoom : 15,          // 拡大倍率
              		center : mapLatLng  // 緯度・経度
            	};
            	// マップオブジェクト作成
            	var map = new google.maps.Map(
              		document.getElementById("map"), // マップを表示する要素
              		mapOptions         // マップオプション
            	);
				//　マップにマーカーを表示する
				hotelMarkerDisp(map);
          	},
          	// 取得失敗した場合
          	function(error) {
            	// エラーメッセージを表示
            	switch(error.code) {
              		case 1: // PERMISSION_DENIED
                		alert("位置情報の利用が許可されていません");
                		break;
              		case 2: // POSITION_UNAVAILABLE
                		alert("現在位置が取得できませんでした");
                		break;
              		case 3: // TIMEOUT
                		alert("タイムアウトになりました");
                		break;
              		default:
                		alert("その他のエラー(エラーコード:"+error.code+")");
                		break;
            	}
          	}
        );
    // Geolocation APIに対応していない
    } else {
        alert("この端末では位置情報が取得できません");
    }
}

//マップオブジェクトを引数とし、マップにホテル情報(マーカー)を表示
function hotelMarkerDisp(map) {

	var marker = [];
	var infoWindow = [];

	// ホテル情報を取得
	var markerData = JSON.parse($('#mapInfo').text());

	for (var i = 0; i < markerData.length; i++) {
		var latVal = Number(markerData[i]['lat']);
		var lngVal = Number(markerData[i]['lng']);
        markerLatLng = new google.maps.LatLng({lat: latVal, lng: lngVal}); // 緯度経度のデータ作成
        marker[i] = new google.maps.Marker({ // マーカーの追加
        	position: markerLatLng, // マーカーを立てる位置を指定
            map: map // マーカーを立てる地図を指定
       	});
		
		var bDateLink = '<div class="detailDisp" value="' + markerData[i]['id'] + '">' + markerData[i]['name'] + '</div><div class="actMsg">営業中</div>';
		var hDateLink = '<div class="detailDisp" value="' + markerData[i]['id'] + '">' + markerData[i]['name'] + '</div><div class="errMsg">営業時間外</div>';
		// var exLink = '<div class="url"><a href="' + markerData[i]['url'] + '">' + markerData[i]['name'] + '</a></div>';

   		infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
			// 吹き出しに表示する内容
			content: mapLinkSetting(markerData[i])
		});
		markerEvent(i); // マーカーにクリックイベントを追加

		// マップのリンクの設定
		function mapLinkSetting(jsonData) {

			var ml = '';

			var date = new Date();
			var fDate = new Date();
			var tDate = new Date();
			var weekNum = String(date.getDay());

			var fbTime = jsonData['fromBusTime'] ?? '00:00';
			var tbTime = jsonData['toBusTime'] ?? '00:00';

			fDate.setHours(Number(fbTime.split(':')[0]));
			fDate.setMinutes(Number(fbTime.split(':')[1]));
			fDate.setSeconds(00);

			tDate.setHours(Number(tbTime.split(':')[0]));
			tDate.setMinutes(Number(tbTime.split(':')[1]));
			tDate.setSeconds(00);

			var holidayList = jsonData['regHoliday'];
			var hList = holidayList ? holidayList.split(',') : [];

			if(hList.includes(weekNum)) {
				ml = hDateLink;
			} else {
				if(fbTime == '00:00' && tbTime == '00:00') {
					ml = bDateLink;
				} else if((date >= fDate) && (date <= tDate)) {
					ml = bDateLink;
				} else {
					ml = hDateLink;
				}
			}

			return ml;
		}
 	}
	function markerEvent(i) {
		marker[i].addListener('click', function() { // マーカーをクリックしたとき
			infoWindow[i].open(map, marker[i]); // 吹き出しの表示
		});
	}
}

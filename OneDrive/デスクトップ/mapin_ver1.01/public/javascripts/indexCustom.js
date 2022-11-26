// 会員が登録したホテルの一覧を表示するためのHTML
var tempListHtml = '<tr id="hotelTr_[0]"><th>[1]</th><td class="listMgr"></td><td style="text-align: right;"><a href="[2]">編集</a></td><td style="text-align: right;"><a href="[3]">削除</a></td></tr>';

window.onload = function() {
	var jUsersHotel = JSON.parse($('#registHotelInfo').text());
	
	var prm = location.search.split('?')[1];
	if(prm) {
		prm = prm.split('=')[0];
	}

	if(prm == 'uid') {
		$('.regUser').show();
		$('.nonUser').hide();
		$('.outUser').hide();
	} else {
		if(prm == 'page') {
			$('.outUser').show();
		} else {
			$('.outUser').hide();
		}
		$('.regUser').hide();
		$('.nonUser').show();
	}

	if(Object.keys(jUsersHotel).length != 0) {
		$('#hListTitle').show();
	} else {
		$('#hListTitle').hide();
	}

	// 共通処理（リンク設定）
	linkSetting(['regist_link', 'login_link', 'form_link', 'logout_link']);

	// ホテル一覧の表示
	if(prm == 'uid') {
		usersHotelList(jUsersHotel);
	}
}

function clickSearch(type) {
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
 
   		infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
			// 吹き出しに表示する内容
			content: '<div class="url"><a href="' + markerData[i]['url'] + '">' 
			+ markerData[i]['name'] + '</a></div>'
		});
		markerEvent(i); // マーカーにクリックイベントを追加
 	}
	function markerEvent(i) {
		marker[i].addListener('click', function() { // マーカーをクリックしたとき
			infoWindow[i].open(map, marker[i]); // 吹き出しの表示
		});
	}
}

// 会員が登録したホテルを一覧で表示
function usersHotelList(jUsersHotel) {
	for (var i in jUsersHotel) {
		var listHtml = tempListHtml;
		var hid = jUsersHotel[i].id;
		var hnm = jUsersHotel[i].name;
		listHtml = listHtml.replace('[0]', hid);
		listHtml = listHtml.replace('[1]', hnm);
		listHtml = listHtml.replace('[2]', location.protocol + '//' + location.host + location.pathname + 'updHotel/' + location.search + '&hid=' + hid);
		listHtml = listHtml.replace('[3]', location.protocol + '//' + location.host + location.pathname + 'delHotel/' + location.search + '&hid=' + hid);
		$('#uHotelTbody').append(listHtml);
	}
}

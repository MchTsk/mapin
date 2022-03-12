function clickSearch(type) {
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
				hotelMarkerDisp(map);
            	//　マップにマーカーを表示する
            	// var marker = new google.maps.Marker({
              	// 	map : map,             // 対象の地図オブジェクト
              	// 	position : mapLatLng   // 緯度・経度
            	// });
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
			content: '<div class="sample">' + markerData[i]['name'] + '</div>' // 吹き出しに表示する内容
		});
		markerEvent(i); // マーカーにクリックイベントを追加
 	}
	function markerEvent(i) {
		marker[i].addListener('click', function() { // マーカーをクリックしたとき
			infoWindow[i].open(map, marker[i]); // 吹き出しの表示
		});
	}
}

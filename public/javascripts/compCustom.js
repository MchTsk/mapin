window.onload = function() {

	var param = location.search.split('=')[1];
	var corpList = ["regHotel", "updHotel", "delHotel"];
	var genList = ["reserve", "cancel"];
	if(corpList.includes(param)) {
		$('.copUser, .comUser').show();
		$('.genUser, .nonUser').hide();
	} else if(genList.includes(param)) {
		$('.genUser, .comUser').show();
		$('.copUser, .nonUser').hide();
	} else {
		$('.nonUser').show();
		$('.genUser, .copUser, .comUser').hide();
	}
}

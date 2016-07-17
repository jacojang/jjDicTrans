function initAudio() {
	var audio = document.createElement('AUDIO');
	audio.id = 'my_player';
	var body = document.getElementsByTagName('BODY')[0];
	body.appendChild(audio);

	return audio;
}

function removeElement(querys) {
	for (var i in querys) {
		var query = querys[i];
		var obj = document.querySelector(query);
		if (obj) { obj.style.display = 'none'; }
	}
}

function removeBackground(querys) {
	for (var i in querys) {
		var query = querys[i];
		var obj = document.querySelector(query);
		if (obj) { obj.style.background = 'none'; }
	}
}

function daumDictModify(audio) {
	//removeElement(['header']);
	//removeBackground(['#daumWrap']);
	//var btn = document.querySelector('.btn_before');
	//btn.addEventListener('onclick', function(){
	//	console.log("alskdjflaksdjflaskdjf");
	//}, false);
	return;
}

function naverDictModify(audio) {
	//removeElement(['#header','#top_search']);
	//removeElement(['#header']);
}

function googleTransModify(audio) {
	//removeElement(['#gb','#gba']);
}

self.port.on('init_platform',function(platform) {
	// Mac = darwin
	// Linux = linux
	// Windows = winnt
	var audio = initAudio();

	document.documentElement.style.overflowX = 'hidden';

	// 1. is daum?
	var isDaum = (document.location.host.indexOf('daum') != -1) ? true : false;
	// 2. is naver?
	var isNaver = (document.location.host.indexOf('naver') != -1) ? true : false;
	// 3. is google?
	var isGoogle = (document.location.host.indexOf('google') != -1) ? true : false;

	/*
	if (platform == 'winnt') {
		if (isDaum) { daumDictModify(audio); }
		if (isNaver) { naverDictModify(audio,true); }
	}else if (platform == 'linux') {
		//if (is_daum) daum_dict_modify(audio);
		//if (is_naver) naver_dict_modify(audio,true);
	}else if (platform == 'darwin') {
		if (isNaver) { naverDictModify(audio,false); }
	}
	*/
	if (isDaum) { daumDictModify(audio); }
	if (isNaver) { naverDictModify(audio); }
	if (isGoogle) { googleTransModify(audio); }
});

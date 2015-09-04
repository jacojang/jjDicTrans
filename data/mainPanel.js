function initAudio() {
	var audio = document.createElement('AUDIO');
	audio.id = 'my_player';
	var body = document.getElementsByTagName('BODY')[0];
	body.appendChild(audio);

	return audio;
}

function daumDictModify(audio) {
	if (!audio) { audio = document.getElementById('my_player'); }

	var as = document.getElementsByTagName('A');
	for (var i = 0 ; i < as.length ; ++i) {
		var a = as[i];
		var cname = a.className;

		if (cname == 'btn_comm btn_listen') {
			var re = /.*'(http.*)'.*/;
			var rea = re.exec(a.onclick.toString());
			(function(obj, url) {
				obj.addEventListener('click',function(event) {
					audio.src = url;
					audio.play();
				});
			})(a,rea[1]);
		}
	}

	// Word Speaking
	var as = document.getElementsByTagName('A');
	for (var i in as) {
		var a = as[i];
		var cname = a.className;
		if (cname == 'btn_comm btn_listen') {
			var re = /.*'(http.*)'.*/;
			var rea = re.exec(a.onclick.toString());
			var url = rea[1];
			var pnode = a.parentNode;

			// create Element
			var newImg = document.createElement('IMG');
			newImg.style.cursor = 'pointer';
			newImg.src = 'http://m1.daumcdn.net/imgsrc.search/dic/dic_2014/images/m320/btn_comm_131210.gif';
			pnode.insertBefore(newImg,a);
			a.style.display = 'none';

			(function(obj, url) {
				obj.addEventListener('click',function(event) {
					audio.src = url;
					audio.play();
				});
			})(newImg,url);
		}
	}

}

var naverSpeechURL = function(sText, oOptions, vcode) {
	var oOptions = oOptions || {};
	var fUcssafeutf8 = function(str) {
		var rtn = '';
		var strLength = str.length;
		var u;
		var s;
		for (i = 0; i < strLength ; i++) {
			u = str.charCodeAt(i);
			if ((u >= 0x00) && (u <= 0x7f)) {
				s = '0' + u.toString(16);
				rtn += '%' + s.substr(s.length - 2);
			} else if (u > 0x1fffff) {
				rtn += '%' + (oxf0 + ((u & 0x1c0000) >> 18)).toString(16);
				rtn += '%' + (0x80 + ((u & 0x3f000) >> 12)).toString(16);
				rtn += '%' + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
				rtn += '%' + (0x80 + (u & 0x3f)).toString(16);
			} else if (u > 0x7ff) {
				rtn += '%' + (0xe0 + ((u & 0xf000) >> 12)).toString(16);
				rtn += '%' + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
				rtn += '%' + (0x80 + (u & 0x3f)).toString(16);
			} else {
				rtn += '%' + (0xc0 + ((u & 0x7c0) >> 6)).toString(16);
				rtn += '%' + (0x80 + (u & 0x3f)).toString(16);
			}
		}
		return rtn;
	};

	oOptions.spkID = oOptions.spkID || 302; // 디폴트는 일본어 여자 발음
	oOptions.speed = oOptions.speed || 70; // 디폴트는 100       控制搜索列表中下关部分的发音速度【TTS】默认：100；行 2785 进行调整参数设置

	var speaker = 'clara';
	if (oOptions == 'ko') { speaker = 'mijin'; }
	var sSafeText = fUcssafeutf8(sText);
	if (navigator.userAgent.indexOf('Android 2.3') > -1 ||
		navigator.userAgent.indexOf('Android 2.2') > -1 ||
		navigator.userAgent.indexOf('Android 2.1') > -1 ||
		navigator.userAgent.indexOf('Android 2.0') > -1 ||
		navigator.userAgent.indexOf('iPhone OS 4_0') > -1) {
		location.href = 'http://endic.naver.com/nvoice?speaker=' + speaker +
						'&service=endic&speech_fmt=mp3&text=' + sSafeText +
						'&vcode=' + vcode + '&from=endic';
	} else {
		return 'http://endic.naver.com/nvoice?speaker=' +
				speaker + '&service=endic&speech_fmt=mp3&text=' + sSafeText +
				'&vcode=' + vcode + '&from=endic';
	}
};

function naverDictModify(audio) {
	if (!audio) { audio = document.getElementById('my_player'); }

	// Word Speaking
	var as = document.getElementsByTagName('A');
	for (var i in as) {
		var a = as[i];
		var cname = a.className;
		if (cname == 'play3') {
			var url = a.getAttribute('playlist');
			var img = a.querySelector('.play');
			var pnode = a.parentNode;

			// create Element
			var newImg = document.createElement('IMG');
			newImg.style.cursor = 'pointer';
			newImg.src = img.src;
			pnode.insertBefore(newImg,a);
			a.style.display = 'none';

			(function(obj, url) {
				obj.addEventListener('click',function(event) {
					audio.src = url;
					audio.play();
				});
			})(newImg,url);
		}
	}

	// Sentence Speaking
	var as = document.getElementsByTagName('A');
	console.log('vcode=' + vcode + ', as.length=' + as.length);
	for (var i = 0; i < as.length; i++) {
		var a = as[i];
		var img = a.querySelector('img');
		var vcode = (img) ? img.getAttribute('vcode') : null;

		if (vcode && vcode.length > 0) {
			var pnode = a.parentNode; if (!pnode) { continue; }
			var fntE07 = pnode.querySelector('.fnt_e07').textContent;

			// create Element
			var newImg = document.createElement('IMG');
			newImg.style.cursor = 'pointer';
			newImg.src = img.src;
			newImg.alt = 'asdfasdfasdfasdf';
			pnode.insertBefore(newImg,a);
			a.style.display = 'none';
			img.style.display = 'none';

			(function(obj, text, vcode) {
				obj.addEventListener('click',function(event) {
					var url = naverSpeechURL(text, '', vcode);
					audio.src = url;
					audio.play();
				});
			})(newImg,fntE07,vcode);
		}
	}
}

self.port.on('init_platform',function(platform) {
	// Mac = darwin
	// Linux = linux
	// Windows = winnt
	var audio = initAudio();

	// 1. is daum?
	var isDaum = (document.location.host.indexOf('daum') != -1) ? true : false;
	// 2. is naver?
	var isNaver = (document.location.host.indexOf('naver') != -1) ? true : false;

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
});

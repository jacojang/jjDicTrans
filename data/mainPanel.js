function init_audio(){
	var audio = document.createElement("AUDIO");		
	audio.id="my_player";
	var body = document.getElementsByTagName("BODY")[0];
	body.appendChild(audio);

	return audio;
}

function daum_dict_modify(audio){	
	if(!audio){ audio = document.getElementById("my_player"); }
	var as = document.getElementsByTagName("A");
	for( var i = 0 ; i < as.length ; ++i){
		var a = as[i];
		var cname = a.className;

		if(cname == "btn_comm btn_listen"){
			var re = /.*'(http.*)'.*/;
			var rea = re.exec(a["onclick"].toString());
			console.log(rea);
			a.addEventListener("click",function(event){
				audio.src = rea[1] ;
				audio.play();
			});	
		}
	}
}

var naver_speech_url = function(sText, oOptions, vcode) {
    var oOptions = oOptions || {};
    
    var fUcssafeutf8 = function(str) {
        var rtn = "";
        var for_i = 0;
        var str_length = str.length;
        var u;
        var s;
        for(i=0; i < str_length ; i++) {
            u = str.charCodeAt(i);
            if ( (u >= 0x00) && (u <= 0x7f) ) {
                s= "0" + u.toString(16);
                rtn += "%" + s.substr(s.length-2);
            } else if ( u > 0x1fffff ) {
                rtn += "%" + (oxf0 + ((u & 0x1c0000) >> 18)).toString(16);
                rtn += "%" + (0x80 + ((u & 0x3f000) >> 12)).toString(16);
                rtn += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                rtn += "%" + (0x80 + (u & 0x3f)).toString(16);
            } else if ( u > 0x7ff ) {
                rtn += "%" + (0xe0 + ((u & 0xf000) >> 12)).toString(16);
                rtn += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                rtn += "%" + (0x80 + (u & 0x3f)).toString(16);
            } else {
                rtn += "%" + (0xc0 + ((u & 0x7c0) >> 6)).toString(16);
                rtn += "%" + (0x80 + (u & 0x3f)).toString(16);
            }
        }
        return rtn;

    };

    oOptions.spkID = oOptions.spkID || 302; // 디폴트는 일본어 여자 발음
    oOptions.speed = oOptions.speed || 70; // 디폴트는 100       控制搜索列表中下关部分的发音速度【TTS】默认：100；行 2785 进行调整参数设置

	var speaker = "clara";
	if (oOptions == "ko"){ speaker = "mijin"; }
	var sSafeText = fUcssafeutf8(sText);
	if (navigator.userAgent.indexOf("Android 2.3") > -1 || navigator.userAgent.indexOf("Android 2.2") > -1 || navigator.userAgent.indexOf("Android 2.1") > -1 || navigator.userAgent.indexOf("Android 2.0") > -1 || navigator.userAgent.indexOf("iPhone OS 4_0") > -1){
		location.href = "http://endic.naver.com/nvoice?speaker="+speaker+"&service=endic&speech_fmt=mp3&text="+ sSafeText+"&vcode="+vcode+ "&from=endic";
	}else{
		return "http://endic.naver.com/nvoice?speaker="+speaker+"&service=endic&speech_fmt=mp3&text="+ sSafeText+"&vcode="+vcode+ "&from=endic";
	}
};

function naver_dict_modify(audio){	
	if(!audio){ audio = document.getElementById("my_player"); }
	var as = document.getElementsByTagName("IMG");
	for( var i = 0 ; i < as.length ; ++i){
		var a = as[i];
		var vcode = a.getAttribute("vcode");

		if(vcode && vcode.length > 0){
			var pnode = a.parentNode.parentNode;
			if(!pnode) continue;
			var fnt_e07 = pnode.querySelector(".fnt_e07").textContent;

			(function(text,vcode){
				a.addEventListener("click",function(event){
					var url = naver_speech_url(text,"",vcode);
					audio.src = url;
					audio.play();
				});	
			})(fnt_e07,vcode);
		}
	}
}

var audio = init_audio();

// 1. is daum?
var is_daum = (document.location.host.indexOf("daum") != -1)?true:false;
// 2. is naver?
var is_naver = (document.location.host.indexOf("naver") != -1)?true:false;

if(is_daum) daum_dict_modify(audio);
if(is_naver) naver_dict_modify(audio);
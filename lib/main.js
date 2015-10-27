/**
 * jjDict namespace.
 */

var workers = [];
var backendSet = {
	'en':{
		'dict':{
			'naver':{
				'url':function(txt){ return ["http://endic.naver.com/popManager.nhn?sLn=kr&m=search&query="+encodeURI(txt)+"&searchOption=entry_idiom&isOnlyViewEE=N",false]; },
      			'size':{width:410, height:440 }
			},
			'daum':{
				'url':function(txt){ return ["http://small.dic.daum.net/search.do?q="+encodeURI(txt)+"&dic=eng&search_first=Y",false]; },
				'size':{width:410, height:440 }
			}
		},
		'trans':{
			'naver':{
				'url':function(txt){ var id="transEditorText"; return ["http://translate.naver.com/#/en/ko/",{oid:id,text:txt,btn:"startTranslateBtn"}]; },
      			'size':{width:900, height:420 }
			},
			'google':{
				'url':function(txt){ var id="source"; return ["https://translate.google.co.kr/#en/ko/",{oid:id,text:txt}]; },
      			'size':{width:800, height:420 }
			}
		}
	},
	'jp':{
		'dict':{
			'naver':{
				'url':function(txt){ return ["http://mini.jpdic.naver.com/search.nhn?range=all&q="+encodeURI(txt)+"",false]; },
      			'size':{width:410, height:440 }
			},
			'daum':{
				'url':function(txt){ return ["http://small.dic.daum.net/search.do?q="+encodeURI(txt)+"&dic=jp&search_first=Y",false]; },
				'size':{width:410, height:440 }
			}
		},
		'trans':{
			'naver':{
				'url':function(txt){ var id="transEditorText"; return ["http://translate.naver.com/#/jp/ko/",{oid:id,text:txt,btn:"startTranslateBtn"}]; },
      			'size':{width:900, height:420 }
			},
			'google':{
				'url':function(txt){ var id="source"; return ["https://translate.google.co.kr/#ja/ko/",{oid:id,text:txt}]; },
      			'size':{width:800, height:420 }
			}
		}
	}
};
function getSizePos(t){
	var width = t.size.width;
	var height = t.size.height;
	return {
		width:width,
		height:height,
	}
};
function detachWorker(worker, workerArray) {
	var index = workerArray.indexOf(worker);
	if (index != -1) {
		workerArray.splice(index,1);
	}
}
function iconStateChange(button, state) {
	if (state == true) {
		button.state("window",{
			"icon" : {
				"16":require("sdk/self").data.url("icons/icon_16.png"),
				"32":require("sdk/self").data.url("icons/icon_32.png")
			}
		});
	}else{
		button.state("window",{
			"icon" : {
				"16":require("sdk/self").data.url("icons/icon_16_off.png"),
				"32":require("sdk/self").data.url("icons/icon_32_off.png")
			}
		});
	}
}

if (typeof jjDict === "undefined") {
	var { ToggleButton } = require("sdk/ui/button/toggle");
    var data = require("sdk/self").data;
    var request = require("sdk/request").Request;
    var prefs =  require("sdk/simple-prefs").prefs;
    var system = require("sdk/system");

	var buttonPanel = require("sdk/panel").Panel({
		contentURL: require("sdk/self").data.url("buttonPanel.html"),
		onHide:function(){
			actionButton.state('window',{checked:false});
			iconStateChange(jjDict.button,jjDict.prefs["jjdict.enable"]);
		}
	});

	var actionButton = ToggleButton({
		id: "jjDicTrans-button",
		label: "jjDicTrans",
		icon: {
			"16":data.url("icons/icon_16.png"),
			"32":data.url("icons/icon_32.png")
		},
		onChange: function(state){
			if(state.checked){
				buttonPanel.show({
					position:actionButton,
					width:200,
					height:365
				});
				buttonPanel.port.emit("init_load",jjDict.prefs);
				buttonPanel.port.on("update_prefs",function(type,value){
					if(type=="enable"){
						jjDict.prefs["jjdict.enable"] = value;
						iconStateChange(jjDict.button,jjDict.prefs["jjdict.enable"]);
					}else if(type=="keys"){
						jjDict.prefs["jjdict.keys.shift"] = value["shift"];
						jjDict.prefs["jjdict.keys.ctrl"] = value["ctrl"];
						jjDict.prefs["jjdict.keys.alt"] = value["alt"];
						jjDict.prefs["jjdict.keys.other_key"] = value["other_key"];
						jjDict.prefs["jjdict.keys.dbclick"] = value["dbclick"];
					}else if(type=="backend.dict"){
						jjDict.prefs["jjdict.backend.dict"] = value;
					}else if(type=="backend.trans"){
						jjDict.prefs["jjdict.backend.trans"] = value;
					}
				});
				buttonPanel.port.on("show_main_panel",function(type,value){
						if(type == "dict"){
						}else if(type = "trans"){
						}
				});
				buttonPanel.port.on("open_panel",function(type){
					if(type == "dict"){
						var backend = backendSet[p['jjdict.lang.from']].dict[p['jjdict.backend.dict']];
					}else{
						var backend = backendSet[p['jjdict.lang.from']].trans[p['jjdict.backend.trans']];
					}
			      var t_url = backend.url("");
					var pos = getSizePos(backend);
					var url = t_url[0];
					var text = t_url[1];

					if(jjDict.panel) jjDict.panel.destroy();
					jjDict.panel = require("sdk/panel").Panel({
						contentURL:jjDict.data.url(url),
						contentStyle:"body { backgroun-color:white; border: 1px solid #EEEEEE; }",
						contentScriptFile: jjDict.data.url('mainPanel.js')
					});
					jjDict.panel.port.emit("init_platform",jjDict.system.platform);
					jjDict.panel.show({
						width:pos.width,
						height:pos.height,
						position:jjDict.button
					});

				});
			}
		}
	});

 var jjDict = {
    data : data,
    request : request,
    prefs : prefs,
    panel: false,
    system: system,
    detachWorker : function (worker, workerArray) {
      var index = workerArray.indexOf(worker);
      if(index !== -1) {
        workerArray.splice(index, 1);
      }
    },
    button:actionButton,
    buttonPanel:buttonPanel,
    work:false
  };
};

var p = jjDict.prefs;
// 초기 값 셋팅
{
	if(p["jjdict.enable"] == undefined || p["jjdict.enable"] == ""){p["jjdict.enable"] = true; }
	if(p["jjdict.keys.dbclick"] == undefined || p["jjdict.keys.dbclick"] == ""){p["jjdict.keys.dbclick"] = false; }
	if(p["jjdict.keys.shift"] == undefined || p["jjdict.keys.shift"] == ""){p["jjdict.keys.shift"] = false; }
	if(p["jjdict.keys.ctrl"] == undefined || p["jjdict.keys.ctrl"] == ""){p["jjdict.keys.ctrl"] = false; }
	if(p["jjdict.keys.alt"] == undefined || p["jjdict.keys.alt"] == ""){p["jjdict.keys.alt"] = false; }
	if(p["jjdict.keys.other_key"] == undefined || p["jjdict.keys.other_key"] == ""){p["jjdict.keys.other_key"] = ""; }
	if(p["jjdict.lang.from"] == undefined || p["jjdict.lang.from"] == ""){p["jjdict.lang.from"] = 'en'; }
	if(p["jjdict.lang.to"] == undefined || p["jjdict.lang.to"] == ""){p["jjdict.lang.to"] = 'ko'; }
	if(p["jjdict.backend.dict"] == undefined || p["jjdict.backend.dict"] == ""){p["jjdict.backend.dict"] = "daum"; }
	if(p["jjdict.backend.trans"] == undefined || p["jjdict.backend.trans"] == ""){p["jjdict.backend.trans"] = "google"; }
	iconStateChange(jjDict.button,p["jjdict.enable"]);

	if( p["jjdict.keys.shift"] == false &&
		p["jjdict.keys.ctrl"] == false &&
		p["jjdict.keys.alt"] == false &&
		p["jjdict.keys.dbclick"] == false &&
		p["jjdict.keys.other_key"] == "")
	{
		p["jjdict.keys.shift"] = true; // Default Activation Key
	}
}

var cm = require("sdk/context-menu");
cm.Item({
  label: "Search jjDicTrans",
  context: cm.SelectionContext(),
  contentScript: 'self.on("context", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  if (text.length > 17)' +
                 '    text = text.substr(0, 17) + "...";' +
                 '  return "Search jjDicTrans for : \\"" + text + "\\""; });' +
				'self.on("click", function (node,data) {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
	onMessage: function(text){
		for(var i in workers){
			var work = workers[i];
			work.port.emit('jjdict.context_click',text);
		}
	}
});

require("sdk/page-mod").PageMod({
	include: ['*'],
	contentScriptWhen: 'ready',
	contentScriptFile: jjDict.data.url('jjdict_main.js'),
	contentStyleFile: jjDict.data.url('css/style.css'),
	attachTo: ["top", "frame", "existing"],
	onAttach: function(work) {
		workers.push(work);
		work.on('detach',function(){
			detachWorker(this,workers);
		});
		work.port.emit('jjdict.conf', {
			enable:p['jjdict.enable'],
			shift:p['jjdict.keys.shift'],
			ctrl:p['jjdict.keys.ctrl'],
			alt:p['jjdict.keys.alt'],
			other_key:p['jjdict.keys.other_key'],
			dbclick:p['jjdict.keys.dbclick'],
			lang_from:p['jjdict.lang.from'],
			lang_to:p['jjdict.lang.to'],
			backend_dict:backendSet[p['jjdict.lang.from']].dict[p['jjdict.backend.dict']],
			backend_trans:backendSet[p['jjdict.lang.from']].trans[p['jjdict.backend.trans']]
		});

		require("sdk/simple-prefs").on("", function(){
			work.port.emit('jjdict.conf', {
				enable:p['jjdict.enable'],
				shift:p['jjdict.keys.shift'],
				ctrl:p['jjdict.keys.ctrl'],
				alt:p['jjdict.keys.alt'],
				other_key:p['jjdict.keys.other_key'],
				dbclick:p['jjdict.keys.dbclick'],
				lang_from:p['jjdict.lang.from'],
				lang_to:p['jjdict.lang.to'],
				backend_dict:backendSet[p['jjdict.lang.from']].dict[p['jjdict.backend.dict']],
				backend_trans:backendSet[p['jjdict.lang.from']].trans[p['jjdict.backend.trans']]
			});
		});

		work.port.on('jjdict.request', function(text,type){
			// URL Make
			if(type == "dict"){
				var backend = backendSet[p['jjdict.lang.from']].dict[p['jjdict.backend.dict']];
			}else{
				var backend = backendSet[p['jjdict.lang.from']].trans[p['jjdict.backend.trans']];
			}
			var t_url = backend.url(text);
			var pos = getSizePos(backend);
			var url = t_url[0];
			var text = t_url[1];

		  	var script = "";
		  	if(text && text.oid && text.oid.length > 0){
		          script = "self.port.on('showtext',function(text){";
		          script +=" 	  document.getElementById('"+text.oid+"').value = text; ";
		          if(text.btn && text.btn.length > 0){
		          	script += "    document.getElementById('"+text.btn+"').click()";
		          }
		          script +="});";
		  	}

			if(jjDict.panel) jjDict.panel.destroy();
			jjDict.panel = require("sdk/panel").Panel({
				contentURL:jjDict.data.url(url),
				contentStyle:"body { backgroun-color:white; border: 1px solid #EEEEEE; }",
				contentScriptFile: jjDict.data.url('mainPanel.js'),
				contentScript:script
			});
			jjDict.panel.port.emit("init_platform",jjDict.system.platform);
			jjDict.panel.show({
				width:pos.width,
				height:pos.height,
				position:jjDict.button
			});
	    	if(text && text.oid && text.oid.length > 0){
	    		jjDict.panel.port.emit("showtext",text.text);
			}
		});

	}
});

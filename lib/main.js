/**
 * jjDict namespace.
 */

var workers = [];
function detachWorker(worker,workerArray){
	var index = workerArray.indexOf(worker);
	if(index != -1){
		workerArray.splice(index,1);
	}	
}
function iconStateChange(button,state){
	if(state == true){
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
					height:295
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
					}else if(type=="dict_backend"){
						jjDict.prefs["jjdict.dict_backend"] = value;
					}else if(type=="trans_backend"){
						jjDict.prefs["jjdict.trans_backend"] = value;
					}
				});
			}
		}
		/*
		onClick: function() {
			if(jjDict.prefs["jjdict.enable"]){
        		jjDict.prefs["jjdict.enable"] = false;
				jjDict.button.state("window", {
       		   "icon" : {
						"16":require("sdk/self").data.url("icons/icon_16_off.png"),
						"32":require("sdk/self").data.url("icons/icon_32_off.png")
					}
        		});
			}else{
        		jjDict.prefs["jjdict.enable"] = true;
				jjDict.button.state("window", {
       		   "icon" : {
						"16":require("sdk/self").data.url("icons/icon_16.png"),
						"32":require("sdk/self").data.url("icons/icon_32.png")
					}
        		});
			}	
		}
		*/
	});

 var jjDict = {
    data : data,
    request : request,
    prefs : prefs,
    panel: false,
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
	if(p["jjdict.dict_backend"] == undefined || p["jjdict.keys.dict_backend"] == ""){p["jjdict.dict_backend"] = "daum"; }
	if(p["jjdict.trans_backend"] == undefined || p["jjdict.keys.trans_backend"] == ""){p["jjdict.trans_backend"] = "google"; }
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
			shift:p['jjdict.keys.shift'],
			ctrl:p['jjdict.keys.ctrl'],
			alt:p['jjdict.keys.alt'],
			other_key:p['jjdict.keys.other_key'],
			dbclick:p['jjdict.keys.dbclick'],
			dict_backend:p['jjdict.dict_backend'],
			trans_backend:p['jjdict.trans_backend']
		});

		require("sdk/simple-prefs").on("", function(){
			work.port.emit('jjdict.conf', {
				shift:p['jjdict.keys.shift'],
				ctrl:p['jjdict.keys.ctrl'],
				alt:p['jjdict.keys.alt'],
				other_key:p['jjdict.keys.other_key'],
				dbclick:p['jjdict.keys.dbclick'],
				dict_backend:p['jjdict.dict_backend'],
				trans_backend:p['jjdict.trans_backend']
			});
		});

		work.port.on('jjdict.request', function(url,text,pos){
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
				contentScript:script
			}); 
			jjDict.panel.show({
					width:pos.width,
					height:pos.height,
					position:{
					top:pos.top,
					left:pos.left
				} 
			});

        	if(text && text.oid && text.oid.length > 0){
        		jjDict.panel.port.emit("showtext",text.text);
			}
		});

		work.port.on('jjdict.check_selection', function(){
			if(p["jjdict.enable"] == false) return;

			//var system = require("sdk/system");
			//console.log("platform = " + system.platform);

			var selection = require("sdk/selection");
			if(selection.text){
				var selection_text = selection.text.trim();
				if(selection_text.split(" ").length > 1){
					work.port.emit("jjdict.trans_mode",selection_text);
					return;
				}
				work.port.emit("jjdict.dict_mode",selection.text);
			}else{
				// Dictionary Mode
				work.port.emit("jjdict.dict_mode",false);
			}
		});
	}
});


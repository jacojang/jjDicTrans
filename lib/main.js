/**
 * jjDict namespace.
 */
if (typeof jjDict === "undefined") {
	var { ActionButton } = require("sdk/ui/button/action");
	var actionButton = ActionButton({
		id: "jjDicTrans-button",
		label: "jjDicTrans",
		icon: {
		"16":require("sdk/self").data.url("icons/icon_16.png"),
		"32":require("sdk/self").data.url("icons/icon_32.png")
		},
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
	});

  var jjDict = {
    data : require("sdk/self").data,
    request : require("sdk/request").Request,
    prefs : require("sdk/simple-prefs").prefs,
    panel: false,
    detachWorker : function (worker, workerArray) {
      var index = workerArray.indexOf(worker);
      if(index !== -1) {
        workerArray.splice(index, 1);
      }
    },
    button:actionButton
  };
};

var p = jjDict.prefs;
if(!p["jjdict.enable"] || p["jjdict.enable"] == ""){
	p["jjdict.enable"] = true;
}

if(p["jjdict.enable"]){
	jjDict.button.state("window", {
		"icon" : {
			"16":require("sdk/self").data.url("icons/icon_16.png"),
			"32":require("sdk/self").data.url("icons/icon_32.png")
		}
	});
}else{
	jjDict.button.state("window", {
		"icon" : {
			"16":require("sdk/self").data.url("icons/icon_16_off.png"),
			"32":require("sdk/self").data.url("icons/icon_32_off.png")
		}
	});
}

require("sdk/page-mod").PageMod({
	include: ['*'],
	contentScriptWhen: 'ready',
	contentScriptFile: jjDict.data.url('jjdict_main.js'),
	contentStyleFile: jjDict.data.url('css/style.css'),
	attachTo: ["top", "frame", "existing"],
	onAttach: function(work) {
		work.port.emit('jjdict.conf', {
			key:p['jjdict.key'],
			dict_backend:p['jjdict.dict_backend'],
			trans_backend:p['jjdict.trans_backend']
		});

		require("sdk/simple-prefs").on("", function(){
			work.port.emit('jjdict.conf', {
				key:p['jjdict.key'],
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
				var selection_text = selection.text;
				if(selection_text.trim().split(" ").length > 1){
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


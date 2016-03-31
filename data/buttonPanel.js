var p_other_key = "";

function enable_clicked(){
	var enable = document.getElementById("enable");
	var enable_value = false;
	if(enable.checked == true){
		enable_value = true;
	}
	addon.port.emit('update_prefs',"enable",enable_value);
}

function all_key_unchecked(shift,ctrl,alt,other_key,dbclick){
	//console.log("shift="+shift.checked+", ctrl="+ctrl.checked+", alt="+alt.checked+", other_key="+other_key.value );
	if(shift.checked == false &&
		ctrl.checked == false &&
		alt.checked == false &&
		dbclick.checked == false &&
		other_key.value == "")
	{
		return true;
	}
	return false;
}

function get_code_from_string(str){
	if(str.length < 1) return -1;
	if(str == "Backspace"){ return 8; }
	if(str == "Tab"){ return 9; }
	if(str == "Enter"){ return 13; }
	if(str == "Shift"){ return 16; }
	if(str == "Ctrl"){ return 17; }
	if(str == "Alt"){ return 18; }
	if(str == "Pause/break"){ return 19; }
	if(str == "Caps lock"){ return 20; }
	if(str == "Escape"){ return 27; }
	if(str == "Page up"){ return 33; }
	if(str == "Page down"){ return 34; }
	if(str == "End"){ return 35; }
	if(str == "Home"){ return 36; }
	if(str == "Left arrow"){ return 37; }
	if(str == "Up arrow"){ return 38; }
	if(str == "Right arrow"){ return 39; }
	if(str == "Down arrow"){ return 40; }
	if(str == "Insert"){ return 45; }
	if(str == "Delete"){ return 46; }
	if(str == "Left window"){ return 91; }
	if(str == "Right window"){ return 92; }
	if(str == "Select key"){ return 93; }
	if(str == "Numpad 0"){ return 96; }
	if(str == "Numpad 1"){ return 97; }
	if(str == "Numpad 2"){ return 98; }
	if(str == "Numpad 3"){ return 99; }
	if(str == "Numpad 4"){ return 100; }
	if(str == "Numpad 5"){ return 101; }
	if(str == "Numpad 6"){ return 102; }
	if(str == "Numpad 7"){ return 103; }
	if(str == "Numpad 8"){ return 104; }
	if(str == "Numpad 9"){ return 105; }
	if(str == "Multiply"){ return 106; }
	if(str == "Add"){ return 107; }
	if(str == "Subtract"){ return 109; }
	if(str == "Decimal point"){ return 110; }
	if(str == "Divide"){ return 111; }
	if(str == "F1"){ return 112; }
	if(str == "F2"){ return 113; }
	if(str == "F3"){ return 114; }
	if(str == "F4"){ return 115; }
	if(str == "F5"){ return 116; }
	if(str == "F6"){ return 117; }
	if(str == "F7"){ return 118; }
	if(str == "F8"){ return 119; }
	if(str == "F9"){ return 120; }
	if(str == "F10"){ return 121; }
	if(str == "F11"){ return 122; }
	if(str == "F12"){ return 123; }
	if(str == "Num lock"){ return 144; }
	if(str == "Scroll lock"){ return 145; }
	if(str == ";"){ return 186; }
	if(str == "="){ return 187; }
	if(str == ","){ return 188; }
	if(str == "-"){ return 189; }
	if(str == "."){ return 190; }
	if(str == "/"){ return 191; }
	if(str == "`"){ return 192; }
	if(str == "["){ return 219; }
	if(str == "\\"){ return 220; }
	if(str == "]"){ return 221; }
	if(str == "'"){ return 222; }

	return str.charCodeAt(0);
}

function get_string_from_code(keyCode){
	if(isNaN(keyCode) || keyCode=="" || keyCode == -1){
		return "";
	}
	var ret = String.fromCharCode(keyCode);
	if (keyCode == 8) ret = "Backspace";
	if (keyCode == 9) ret = "Tab";
	if (keyCode == 13) ret = "Enter";
	if (keyCode == 16) ret = "Shift";
	if (keyCode == 17) ret = "Ctrl";
	if (keyCode == 18) ret = "Alt";
	if (keyCode == 19) ret = "Pause/break";
	if (keyCode == 20) ret = "Caps lock";
	if (keyCode == 27) ret = "Escape";
	if (keyCode == 33) ret = "Page up";
	if (keyCode == 34) ret = "Page down";
	if (keyCode == 35) ret = "End";
	if (keyCode == 36) ret = "Home";
	if (keyCode == 37) ret = "Left arrow";
	if (keyCode == 38) ret = "Up arrow";
	if (keyCode == 39) ret = "Right arrow";
	if (keyCode == 40) ret = "Down arrow";
	if (keyCode == 45) ret = "Insert";
	if (keyCode == 46) ret = "Delete";
	if (keyCode == 91) ret = "Left window";
	if (keyCode == 92) ret = "Right window";
	if (keyCode == 93) ret = "Select key";
	if (keyCode == 96) ret = "Numpad 0";
	if (keyCode == 97) ret = "Numpad 1";
	if (keyCode == 98) ret = "Numpad 2";
	if (keyCode == 99) ret = "Numpad 3";
	if (keyCode == 100) ret = "Numpad 4";
	if (keyCode == 101) ret = "Numpad 5";
	if (keyCode == 102) ret = "Numpad 6";
	if (keyCode == 103) ret = "Numpad 7";
	if (keyCode == 104) ret = "Numpad 8";
	if (keyCode == 105) ret = "Numpad 9";
	if (keyCode == 106) ret = "Multiply";
	if (keyCode == 107) ret = "Add";
	if (keyCode == 109) ret = "Subtract";
	if (keyCode == 110) ret = "Decimal point";
	if (keyCode == 111) ret = "Divide";
	if (keyCode == 112) ret = "F1";
	if (keyCode == 113) ret = "F2";
	if (keyCode == 114) ret = "F3";
	if (keyCode == 115) ret = "F4";
	if (keyCode == 116) ret = "F5";
	if (keyCode == 117) ret = "F6";
	if (keyCode == 118) ret = "F7";
	if (keyCode == 119) ret = "F8";
	if (keyCode == 120) ret = "F9";
	if (keyCode == 121) ret = "F10";
	if (keyCode == 122) ret = "F11";
	if (keyCode == 123) ret = "F12";
	if (keyCode == 144) ret = "Num lock";
	if (keyCode == 145) ret = "Scroll lock";
	if (keyCode == 186) ret = ";";
	if (keyCode == 187) ret = "=";
	if (keyCode == 188) ret = ",";
	if (keyCode == 189) ret = "-";
	if (keyCode == 190) ret = ".";
	if (keyCode == 191) ret = "/";
	if (keyCode == 192) ret = "`";
	if (keyCode == 219) ret = "[";
	if (keyCode == 220) ret = "\\";
	if (keyCode == 221) ret = "]";
	if (keyCode == 222) ret = "'";
	return ret;
}

function link_clicked(type,data){
	addon.port.emit("show_main_panel",type,data);
}

function activation_key_clicked(key){
	var shift = document.getElementById("shift");
	var ctrl = document.getElementById("ctrl");
	var alt = document.getElementById("alt");
	var other_key = document.getElementById("other_key");
	var dbclick = document.getElementById("dbclick");

	if(all_key_unchecked(shift,ctrl,alt,other_key,dbclick)){
		//console.log("all_key_unchecked1="+key);
		if(key == "shift"){ shift.checked = true; }
		if(key == "ctrl"){ ctrl.checked = true; }
		if(key == "alt"){ alt.checked = true; }
		if(key == "dbclick"){ dbclick.checked = true; }
	}

	addon.port.emit('update_prefs',"keys",{shift:shift.checked,ctrl:ctrl.checked,alt:alt.checked,other_key:get_code_from_string(other_key.value),dbclick:dbclick.checked});
}

function activation_other_key(event){
	if(event.defaultPrevented){ return; }

	var shift = document.getElementById("shift");
	var ctrl = document.getElementById("ctrl");
	var alt = document.getElementById("alt");
	var other_key = document.getElementById("other_key");
	var dbclick = document.getElementById("dbclick");

	if(event.keyCode == 8 || event.keyCode == 16 || event.keyCode == 17 || event.keyCode == 18  ) {  //Backspace, Shift, Ctrl, Alt
		other_key.value = "";
	}else{
		other_key.value = get_string_from_code(event.keyCode);
	}

	if(all_key_unchecked(shift,ctrl,alt,other_key,dbclick)){
		//console.log("all_key_unchecked="+p_other_key);
		other_key.value = p_other_key;
	}

	p_other_key = other_key.value;

	addon.port.emit('update_prefs',"keys",{shift:shift.checked,ctrl:ctrl.checked,alt:alt.checked,other_key:get_code_from_string(other_key.value),dbclick:dbclick.checked});
}

function other_key_focused(e){
	var other_key = document.getElementById("other_key");
	other_key.value = "";
}

function other_key_blured(e){
	var other_key = document.getElementById("other_key");
	other_key = p_other_key;
}


function backend_dict_changed(){
	var backend_dict = document.getElementById("backend_dict");
	for(var i=0; i < backend_dict.options.length; i++){
		var opt = backend_dict.options[i];
		if(opt.selected == true){
			addon.port.emit('update_prefs',"backend.dict",opt.value);
		}
	}
}
function backend_trans_changed(){
	var backend_trans = document.getElementById("backend_trans");
	for(var i=0; i < backend_trans.options.length; i++){
		var opt = backend_trans.options[i];
		if(opt.selected == true){
			addon.port.emit('update_prefs',"backend.trans",opt.value);
		}
	}
}

function mode_changed(){
	var mode = document.getElementById("mode");
	for(var i=0; i < mode.options.length; i++){
		var opt = mode.options[i];
		if(opt.selected == true){
			addon.port.emit('update_prefs',"mode",opt.value);
		}
	}
}

function popup_pos_changed(){
	var popup_pos = document.getElementById("popup_pos");
	for(var i=0; i < popup_pos.options.length; i++){
		var opt = popup_pos.options[i];
		if(opt.selected == true){
			addon.port.emit('update_prefs',"popup_pos",opt.value);
		}
	}
}

function open_panel(type){
		addon.port.emit('open_panel',type);
}
addon.port.on("init_load",function(prefs){
	var enable = document.getElementById("enable");
	if(prefs["jjdict.enable"] == true){
		enable.checked = true;
	}else{
		enable.checked = false;
	}

	var shift = document.getElementById("shift");
	var ctrl = document.getElementById("ctrl");
	var alt = document.getElementById("alt");
	var other_key = document.getElementById("other_key");
	var dbclick = document.getElementById("dbclick");

	if(prefs["jjdict.keys.shift"] == true){ shift.checked = true; }
	if(prefs["jjdict.keys.ctrl"] == true){ ctrl.checked = true; }
	if(prefs["jjdict.keys.alt"] == true){ alt.checked = true; }
	if(prefs["jjdict.dbclick"] == true){ dbclick.checked = true; }

	p_other_key = get_string_from_code(prefs["jjdict.keys.other_key"]);
	other_key.value = p_other_key;

	var mode = document.getElementById("mode");
	for(var i=0; i < mode.options.length; i++){
		var opt = mode.options[i];
		if(opt.value == prefs["jjdict.mode"]){
			opt.selected = true;
		}else{
			opt.selected = false;
		}
	}

	var backend_dict = document.getElementById("backend_dict");
	for(var i=0; i < backend_dict.options.length; i++){
		var opt = backend_dict.options[i];
		if(opt.value == prefs["jjdict.backend.dict"]){
			opt.selected = true;
		}else{
			opt.selected = false;
		}
	}

	var backend_trans = document.getElementById("backend_trans");
	for(var i=0; i < backend_trans.options.length; i++){
		var opt = backend_trans.options[i];
		if(opt.value == prefs["jjdict.backend.trans"]){
			opt.selected = true;
		}else{
			opt.selected = false;
		}
	}

	var popup_pos = document.getElementById("popup_pos");
	for(var i=0; i < popup_pos.options.length; i++){
		var opt = popup_pos.options[i];
		if(opt.value == prefs["jjdict.popup_pos"]){
			opt.selected = true;
		}else{
			opt.selected = false;
		}
	}
});

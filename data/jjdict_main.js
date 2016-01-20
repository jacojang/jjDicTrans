/**
 * @file jjdict_main
 * @author jacojang <jacojang@jacojang.com>
 */

var SHIFT = 16;
var CTRL = 17;
var ALT = 18;

if(typeof jjdict === "undefined"){
	var jjdict = {
		boundptn:null,
        keys:{
            shift:false,
            ctrl:false,
            alt:false,
            dbclick:false,
            other_key:-1
        },
        keys_clicked:{
            shift:false,
            ctrl:false,
            alt:false,
            dbclick:false,
            other_key:-1
        },
        enable:true,
        mode:0,
        popup_pos:0,
        word: null,
        mouseX: 0,
        mouseY: 0,
        mouseTarget: null,
        keydown: false,
        backend:{
			dict:null,
			trans:null
		},
		lang:{
			from:'en',
			to:'ko'
		},
		selection:false,
		selectionObj:false,
		hotkeydown: false,
		backendBoundPtn:{
			'en':{ boundptn: /[^0-9a-zA-Z\-\_\.\,]/ },
			'jp':{ boundptn: /[^0-9\u3040-\u30ff\u31f0-\u31ff\-\_\.\,]/ }
		},
	    init: function () {
            try{
                document.body.addEventListener('dblclick', function (event) {
                    jjdict.onDblclick.call(jjdict, event);
                });
                document.body.addEventListener('mousemove', function (event) {
                    jjdict.onmove.call(jjdict, event);
                });
                window.addEventListener('keyup', function (event) {
                    jjdict.onKeyUp.call(jjdict, event);
                });
                window.addEventListener('keydown', function (event) {
                    jjdict.onKeyDown.call(jjdict, event);
                });
            }catch(e){
            }
        },
        onmove:function(e){
			this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseTarget = e.target;
        },
        onDblclick:function(e){
            this.keys_clicked["dbclick"] = true;
            if(this.isHotKeyMatched()){
                this.checkSelectionAndShow();
            }
            this.keys_clicked["dbclick"] = false;
        },
        onKeyUp: function (e) {
            if(this.isHotKeyMatched()){
                this.checkSelectionAndShow();
			}
            this.uncheckHotKey(e.keyCode,e.shiftKey,e.ctrlKey,e.altKey);
        },
        onKeyDown: function (e) {
            this.checkHotKey(e.keyCode,e.shiftKey,e.ctrlKey,e.altKey);
        },
        checkSelectionAndShow:function(){
            if(this.enable == false) return;
            var selobj = window.getSelection();
            var selobj_txt = selobj.toString().trim();

            if(selobj_txt.length > 0){
				this.selection = true;
				this.selectionObj = selobj;
			}

			if(this.mode == 0){
				// 사전 + 번역 Mode
	            if(selobj_txt.length > 0){
	                if(selobj_txt.split(" ").length > 1){
	                    this.showTrans(selobj_txt);
	                }else{
	                    this.showDict(selobj_txt);
	                }
	            }else{
	                this.showDict(false);
	            }
			}else if(this.mode == 1){
				// 사전 Only Mode
	            if(selobj_txt.length > 0){
                    this.showDict(selobj_txt);
				}else{
	                this.showDict(false);
				}
			}else if(this.mode == 2){
				// 번역 Only Mode
    			if(selobj_txt.length > 0){
                    this.showTrans(selobj_txt);
				}else{
                    this.showTrans(false);
				}
			}
        },
		openPanel:function(type){
			if(type=="dict"){
		        var url = this.backend.dict.url("");
		        self.port.emit('jjdict.request', url[0],url[1],this.getSizePos(this.backend.dict));
			}else if(type=="trans"){
		        var url = this.backend.trans.url("");
		        self.port.emit('jjdict.request', url[0],url[1],this.getSizePos(this.backend.trans));
			}
		},
        initHotKey:function(){
            this.keys_clicked["shift"] = false;
            this.keys_clicked["ctrl"] = false;
            this.keys_clicked["alt"] = false;
            this.keys_clicked["other_key"] = -1;
            dbclick = false;
        },
        checkHotKey:function(code,shift,ctrl,alt){
            this.keys_clicked["shift"] = shift;
            this.keys_clicked["ctrl"] = ctrl;
            this.keys_clicked["alt"] = alt;
            if(code == SHIFT) { this.keys_clicked["shift"] = true; return; }
            if(code == CTRL) { this.keys_clicked["ctrl"] = true; return; }
            if(code == ALT) { this.keys_clicked["alt"] = true; return; }
            this.keys_clicked["other_key"] = code;
        },
        uncheckHotKey:function(code,shift,ctrl,alt){
            this.keys_clicked["dbclick"] = false;
            this.keys_clicked["shift"] = shift;
            this.keys_clicked["ctrl"] = ctrl;
            this.keys_clicked["alt"] = alt;
            if(code == SHIFT) { this.keys_clicked["shift"] = false; return; }
            if(code == CTRL) { this.keys_clicked["ctrl"] = false; return; }
            if(code == ALT) { this.keys_clicked["alt"] = false; return; }
            this.keys_clicked["other_key"] = -1;
        },
        keyCheck:function(k,k2){
            if( (k == true && k2 == true) || (k == false && k2 == false) ) return true;
            return false;
        },
        isHotKeyMatched:function(){
            if(!this.keyCheck(this.keys["shift"], this.keys_clicked["shift"])) return false;
            if(!this.keyCheck(this.keys["ctrl"], this.keys_clicked["ctrl"])) return false;
            if(!this.keyCheck(this.keys["alt"], this.keys_clicked["alt"])) return false;
            if(!this.keyCheck(this.keys["dbclick"], this.keys_clicked["dbclick"])) return false;
            if(this.keys["other_key"] > 0){
                if(this.keys["other_key"] != this.keys_clicked["other_key"]){
                    return false;
                }
            }
            return true;
        },
        showTrans:function(txt){
			var selection_words = null;
        	if(txt){
	        	selection_words = txt;
			}else{
	            selection_words = this.getWordAtPoint(this.mouseTarget, this.mouseX, this.mouseY).word;
			}
            if (selection_words) {
				var pos = {top:0,left:0};
				if(this.selection){
					try{
						oRange = this.selectionObj.getRangeAt(0); //get the text range
						oRect = oRange.getBoundingClientRect();
						pos.left = oRect.left;
						pos.top = oRect.top;
					}catch(e){
						pos = false;
					}
				}else{
					pos.left = this.mouseX;
					pos.top = this.mouseY;
				}
	            self.port.emit('jjdict.request',selection_words, "trans", pos);
            }
        },
        showDict:function(txt){
        	if(txt){
        		this.word = {word:txt.trim()};
        	}else{
	            this.word = this.getWordAtPoint(this.mouseTarget, this.mouseX, this.mouseY);
        	}

            if (this.word) {
				var pos = {top:0,left:0};
				if(this.selection){
					try{
						oRange = this.selectionObj.getRangeAt(0); //get the text range
						oRect = oRange.getBoundingClientRect();
						pos.left = oRect.left;
						pos.top = oRect.top;
					}catch(e){
						pos = false;
					}
				}else{
					pos.left = this.mouseX;
					pos.top = this.mouseY;
				}
	            self.port.emit('jjdict.request',this.word.word, "dict",pos);
            }
        },
        setLowBound: function (textElem, range) {
            var pos = range.startOffset;
            while (--pos >= 0) {
                range.setStart(textElem, pos);
                var str = range.toString();
                if (this.boundptn.test(str.charAt(0))) {
                    range.setStart(textElem, ++pos);
                    break;
                }
            }
        },
        setHighBound: function (textElem, range, end) {
            var pos = range.endOffset;
            while (++pos <= end) {
                range.setEnd(textElem, pos);
                var str = range.toString();
                if (this.boundptn.test(str.charAt(str.length - 1))) {
                    range.setEnd(textElem, --pos);
                    break;
                }
            }
        },
        getSelectionAtPoint:function(x,y){
			var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                var range = selection.getRangeAt(0);
                var rect = range.getBoundingClientRect();
                if (rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y) {
                    return ({'word': range.toString(), 'top': y - 10, 'left': x - 5, 'right': x + 5, 'bottom': y + 15});
                }
            }
            return null;
        },
        getWordAtPoint:function(elem,x,y){
        	var selected = this.getSelectionAtPoint(x, y);
            if (selected !== null)
                return selected;
            if (!elem || elem.tagName === 'IFRAME')
                return null;

            if (elem.nodeType === elem.TEXT_NODE) {
                var range = elem.ownerDocument.createRange();
                range.selectNodeContents(elem);
                var currentPos = 0;
                var endPos = range.endOffset;
                while (currentPos + 1 < endPos) {
                    range.setStart(elem, currentPos);
                    range.setEnd(elem, currentPos + 1);
                    var rect = range.getBoundingClientRect();
                    if (rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y) {
                        this.setLowBound(elem, range);
                        this.setHighBound(elem, range, endPos);
                        var ret = range.toString();
                        range.detach();
                        var dy = elem.parentNode.tagName === 'A' ? 20 : 15;
                        return ({'word': ret, 'top': y - 10, 'left': x - 5, 'right': x + 5, 'bottom': y + dy});
                    }
                    currentPos += 1;
                }
            } else {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var childElem = elem.childNodes[i];
                    var range = childElem.ownerDocument.createRange();
                    range.selectNodeContents(childElem);
                    var rect = range.getBoundingClientRect();
                    if (rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y) {
                        range.detach();
                        var word = this.getWordAtPoint(childElem, x, y);
                        if (word)
                            return word;
                    } else {
                        range.detach();
                    }
                }
            }
            return (null);
        },
	};
	jjdict.init();

    self.port.on('jjdict.context_click',function(){
        jjdict.checkSelectionAndShow();
    });

	self.port.on('jjdict.panel_open',function(type){
			jjdict.openPanel(type);
	});

    self.port.on('jjdict.conf', function (conf) {
        jjdict.enable = conf.enable;
        jjdict.mode = conf.mode;
        jjdict.popup_pos = conf.popup_pos;
        jjdict.keys.shift = conf.shift;
        jjdict.keys.ctrl = conf.ctrl;
        jjdict.keys.alt = conf.alt;
        jjdict.keys.other_key = conf.other_key;
        jjdict.keys.dbclick = conf.dbclick;
        jjdict.lang.from = conf.lang_from;
        jjdict.lang.to = conf.lang_from;
        jjdict.backend.dict = conf.backend_dict;
        jjdict.backend.trans = conf.backend_trans;
		jjdict.boundptn = jjdict.backendBoundPtn[jjdict.lang.from].boundptn;
    });
};

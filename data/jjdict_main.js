var SHIFT=16;
var CTRL=17;
var ALT=18;

if(typeof jjdict === "undefined"){
	var jjdict = {
        boundptn: /[^a-zA-Z\-\_\.\,]/,
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
        word: null,
        mouseX: 0,
        mouseY: 0,
        mouseTarget: null,
        keydown: false,
        dict_backend: null,
        trans_backend: null,
		hotkeydown: false,
        backend:{
			dict:{
				naver:{
					url:function(txt){
		        		return ["http://endic.naver.com/popManager.nhn?sLn=kr&m=search&query="+encodeURI(txt)+"&searchOption=entry_idiom&isOnlyViewEE=N",false];
        			},
        			size:{width:408, height:440 }
				},
				daum:{
					url:function(txt){
		        		return ["http://small.dic.daum.net/search.do?q="+encodeURI(txt)+"&dic=eng&search_first=Y",false];
					},
					size:{width:408, height:440 }
				}
			},
			trans:{
				naver:{
					url:function(txt){
						var id="transEditorText";
		        		return ["http://translate.naver.com/#/en/ko/",{oid:id,text:txt,btn:"startTranslateBtn"}];
        			},
        			size:{width:900, height:420 }
				},
				google:{
					url:function(txt){
						var id="source";
		        		return ["https://translate.google.co.kr/#en/ko/",{oid:id,text:txt}];
        			},
        			size:{width:800, height:420 }
				}

			}
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
                self.port.emit("jjdict.check_selection");
            }
            this.keys_clicked["dbclick"] = false;
        },
        onKeyUp: function (e) {
            if(this.isHotKeyMatched()){
				self.port.emit("jjdict.check_selection");
			}
            this.uncheckHotKey(e.keyCode,e.shiftKey,e.ctrlKey,e.altKey);
        },
        onKeyDown: function (e) {
            this.checkHotKey(e.keyCode,e.shiftKey,e.ctrlKey,e.altKey);
        },
        initHotKey:function(){
            this.keys_clicked["shift"] = false;
            this.keys_clicked["ctrl"] = false;
            this.keys_clicked["alt"] = false;
            this.keys_clicked["other_key"] = -1;
            dbclick = false;
        },
        checkHotKey:function(code,shift,ctrl,alt){
            //console.log("shift="+shift+",ctrl="+ctrl+",alt="+alt);
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
            //console.log("k="+k+",k2="+k2);
            if( (k == true && k2 == true) || (k == false && k2 == false) ) return true;
            return false;
        },
        isHotKeyMatched:function(){
            //console.log(this.keys_clicked);
            if(!this.keyCheck(this.keys["shift"], this.keys_clicked["shift"])) return false;
            if(!this.keyCheck(this.keys["ctrl"], this.keys_clicked["ctrl"])) return false;
            if(!this.keyCheck(this.keys["alt"], this.keys_clicked["alt"])) return false;
            if(!this.keyCheck(this.keys["dbclick"], this.keys_clicked["dbclick"])) return false;
            if(this.keys["other_key"] > 0){
                //console.log("other_key="+this.keys["other_key"]+", clicked="+this.keys_clicked["other_key"]);
                if(this.keys["other_key"] != this.keys_clicked["other_key"]){
                    return false; 
                }
            }
            return true;
        },
        getSizePos:function(t){
        	var width = t.size.width;
        	var height = t.size.height;
        	//var top = 0 - (window.outerHeight - window.innerHeight);
            var top = 0;
        	var left = window.outerWidth-(width+2);

        	/*
        	console.log("window.innerWidth="+window.innerWidth+", window.screen.width="+window.screen.width);
        	console.log("window.innerHeight="+window.innerHeight+", window.screen.height="+window.screen.height);
        	console.log("window.screen.top="+window.screen.top+", window.screen.left="+window.screen.left);
        	console.log("window.screenX="+window.screenX+", window.screenY="+window.screenY);
        	console.log("window.screen.availTop="+window.screen.availTop+", window.screen.availLeft="+window.screen.availLeft);
        	console.log("window.statusbar.height="+window.statusbar.height+", window.outherHeight="+window.outerHeight);
        	*/


        	return {
        		width:width,
        		height:height,
        		top:top,
        		left:left
        	}
        },
        showTrans:function(selection_txt){
        	this.selection_words = selection_txt;
            if (selection_txt) {
	            var url = this.trans_backend.url(selection_txt);
	            self.port.emit('jjdict.request', url[0],url[1],this.getSizePos(this.trans_backend));
            }
        },
        showDict:function(txt){
			txt = txt.trim();
        	if(txt){
        		this.word = {word:txt};
        	}else{
	            this.word = this.getWordAtPoint(this.mouseTarget, this.mouseX, this.mouseY);
        	}

            if (this.word) {
            	if(!this.word.word.match(/^[A-Za-z0-9\_\-\.\,\/\;\:]+$/)){
    				return;
    			}
	            var url = this.dict_backend.url(this.word.word);
	            self.port.emit('jjdict.request', url[0],url[1],this.getSizePos(this.dict_backend));
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

    self.port.on('jjdict.trans_mode',function(selection_txt){
    	jjdict.showTrans(selection_txt);
    });
    self.port.on('jjdict.dict_mode',function(txt){
    	jjdict.showDict(txt);
    });

    self.port.on('jjdict.conf', function (conf) {
        //console.log(conf);
        jjdict.keys.shift = conf.shift;
        jjdict.keys.ctrl = conf.ctrl;
        jjdict.keys.alt = conf.alt;
        jjdict.keys.other_key = conf.other_key;
        jjdict.keys.dbclick = conf.dbclick;
        jjdict.dict_backend = jjdict.backend.dict[conf.dict_backend];
        jjdict.trans_backend = jjdict.backend.trans[conf.trans_backend];
    });
};

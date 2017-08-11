/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const YaType = __webpack_require__(1);
	
	let option = {
	    strings: [
	        {content: '这是一款定投工具'},
	        {content: '这是一款 ETF 基金定投工具'},
	        {content: '这是一款不太专业的 ETF 基金定投工具'}
	    ],
	    effect: 'back' //back|delete|jump
	}
	
	new YaType('#element', option);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	const defaultOpt = {
	    loop: true,
	    charTime: 600,
	    moveBackTime: 300,
	    deleteBackTime: 300,
	    jumpTime: 300,
	    sentencePauseTime: 1000
	}
	
	class YaType {
	    constructor(el, option){
	        this.el = document.querySelector(el);
	        this.opt = Object.assign({}, defaultOpt, JSON.parse(JSON.stringify(option)));
	        this.currentCentenceIndex = 0;        
	        this.setCursor();
	        this.walk();
	    }
	
	    setCursor(){
	        this.cursorPositioin = 0;
	        this.el.innerHTML = '<i class="yatype__cursor">|</i>';
	        this.cursorStyle = document.querySelector('style[name="yatype"]') || generateStyle();
	
	        function generateStyle(){
	            let style = document.createElement('style'),
	                css = [
	                    '.yatype__cursor {',
	                        'color: black;',
	                        'font-weight: bolder;',
	                        'font-style: normal;',
	                        'animation: 1s flashing step-end infinite;',
	                        '}',
	                    '@keyframes flashing {',
	                        '0%, 100% {',
	                            'color: black;',
	                        '}',
	                        '50% {',
	                            'color: transparent',
	                        '}',
	                    '}'].join('\n');
	                
	            style.setAttribute('name', 'yatype');
	            style.type = 'text/css';
	            if (style.styleSheet){
	                style.styleSheet.cssText = css;
	            } else {
	                style.appendChild(document.createTextNode(css));
	            }
	            document.head.appendChild(style);
	        }
	    }
	
	    walk(){
	        var self = this,
	            strings = self.opt.strings;
	        if(self.currentCentenceIndex == strings.length){
	            if(self.opt.loop){
	                self.currentCentenceIndex = 0;
	                self.setCursor();
	            }else{
	                return;
	            }
	        }
	        switch (self.opt.effect) {
	            case 'back':
	                self.moveBackCursor();
	                break;
	            case 'delete':
	                self.deleteBackCursor();
	                break;
	            case 'jump':
	                self.jumpCursor();
	                break;
	            default:
	                self.moveBackCursor();
	        }
	    }
	
	    moveBackCursor(){
	        var self = this;
	        if(this.currentCentenceIndex == 0){
	            self.typing();
	        } else {
	            moveBack();
	        }
	
	        function moveBack(){
	            var arr = self.prevSentence().split('');
	            arr.splice(self.cursorPositioin, 0, '<i class="yatype__cursor">|</i>');
	            self.el.innerHTML = arr.join('');
	            if(self.cursorPositioin != self.getLastSameCharIndex()){
	                setTimeout(function(){
	                    self.cursorPositioin -= 1
	                    moveBack();
	                }, self.opt.moveBackTime);
	            } else {
	                self.typing();
	            }
	
	        }
	    }
	
	    getLastSameCharIndex(){
	        var self = this;
	        var prevContent = self.prevSentence();
	        var currContent = self.currSentence();
	        var lastSameCharIndex = 0;
	        while(
	                prevContent[lastSameCharIndex] &&
	                currContent[lastSameCharIndex] &&
	                prevContent[lastSameCharIndex] == currContent[lastSameCharIndex]
	            ){
	            lastSameCharIndex ++;
	        }
	        return lastSameCharIndex;
	    }
	
	    deleteBackCursor(){
	        var self = this;
	        if(this.currentCentenceIndex == 0){
	            self.deleteTyping();
	        } else {
	            var prevSentenceCopy = self.prevSentence();
	            deleteBack(prevSentenceCopy);
	        }
	
	        function deleteBack(sentenceToDelete){
	            self.el.innerHTML = sentenceToDelete + '<i class="yatype__cursor">|</i>';
	            if(self.cursorPositioin != self.getLastSameCharIndex()){
	                setTimeout(function(){
	                    self.cursorPositioin -= 1
	                    deleteBack(sentenceToDelete.slice(0,sentenceToDelete.length - 1));
	                }, self.opt.deleteBackTime);
	            } else {
	                self.deleteTyping();
	            }
	
	        }
	    }
	
	    jumpCursor(){
	        //TODO
	        if(this.currentCentenceIndex != 0){
	            var arr = this.prevSentence().split('');
	            arr.splice(this.getLastSameCharIndex(), 0, '<i class="yatype__cursor">|</i>');
	            this.el.innerHTML = arr.join('');
	        }
	        this.typing();
	    }
	
	    prevSentence(){
	        if(this.currentCentenceIndex){
	            return this.opt.strings[this.currentCentenceIndex - 1]['content'];
	        } else {
	            return '';
	        }
	    }
	
	    currSentence(){
	        return this.opt.strings[this.currentCentenceIndex]['content'];
	    }
	
	    typing(){
	        let index = 0,
	            self = this,
	            prevContent = this.prevSentence(),
	            currContent = this.currSentence(),
	            {bPart, mPart, aPart} = this.splitSentence(prevContent, currContent),
	            chars = mPart.split(''),
	            curStr = '';
	        function type(){
	            if(index == chars.length){
	                self.currentCentenceIndex += 1;
	                self.walk();
	                return;
	            }
	            curStr += chars[index++];
	            self.el.innerHTML = self.moveCursor(bPart,curStr, aPart);
	            setTimeout(type, self.opt.charTime);
	        }
	
	        type();
	    }
	
	    deleteTyping(){
	        var self = this,
	            index = 0, 
	            currContent = this.currSentence(),
	            chars = currContent.slice(self.getLastSameCharIndex()),
	            curStr = currContent.slice(0, self.getLastSameCharIndex());
	        function type(){
	            if(index == chars.length){
	                self.currentCentenceIndex += 1;
	                self.walk();
	                return;
	            }
	            curStr += chars[index++];
	            self.cursorPositioin = curStr.length;
	            self.el.innerHTML = curStr + '<i class="yatype__cursor">|</i>';
	            setTimeout(type, self.opt.charTime);
	        }
	
	        type();
	    }
	
	    moveCursor(bPart,curStr, aPart){
	        this.cursorPositioin = bPart.length + curStr.length;
	        return bPart + curStr + '<i class="yatype__cursor">|</i>' + aPart;
	    }
	
	    splitSentence(prev, current){
	        if(!prev){
	            return {bPart: '', mPart: current, aPart: ''};
	        }
	        if(prev == current){
	            console.error('two sentence is the same');
	            return {bPart: current, mPart: '', aPart: ''};
	        }
	        let index = this.getLastSameCharIndex();
	        let bPart = prev.slice(0, index);
	        let aPart = prev.slice(index, prev.length);
	        let inverseIndex = current.lastIndexOf(aPart);
	        let mPart = current.slice(index, inverseIndex);
	        
	        return {bPart,mPart,aPart}
	    }
	};
	module.exports = YaType

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjcwOGU1OTU2ZjFmYmEzOGYwZWMiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUyxvQkFBb0I7QUFDN0IsVUFBUywyQkFBMkI7QUFDcEMsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSxnQzs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkMsdUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXNDO0FBQ3RDLHVDQUFzQztBQUN0Qyw4Q0FBNkM7QUFDN0MsNkNBQTRDO0FBQzVDLG1FQUFrRTtBQUNsRSwyQkFBMEI7QUFDMUIsMkNBQTBDO0FBQzFDLG9DQUFtQztBQUNuQywyQ0FBMEM7QUFDMUMsMkJBQTBCO0FBQzFCLCtCQUE4QjtBQUM5QjtBQUNBLDJCQUEwQjtBQUMxQix1QkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakIsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakIsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsb0JBQW9CO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWdCO0FBQ2hCO0FBQ0E7QUFDQSx3QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiNzA4ZTU5NTZmMWZiYTM4ZjBlYyIsImNvbnN0IFlhVHlwZSA9IHJlcXVpcmUoJy4uJyk7XG5cbmxldCBvcHRpb24gPSB7XG4gICAgc3RyaW5nczogW1xuICAgICAgICB7Y29udGVudDogJ+i/meaYr+S4gOasvuWumuaKleW3peWFtyd9LFxuICAgICAgICB7Y29udGVudDogJ+i/meaYr+S4gOasviBFVEYg5Z+66YeR5a6a5oqV5bel5YW3J30sXG4gICAgICAgIHtjb250ZW50OiAn6L+Z5piv5LiA5qy+5LiN5aSq5LiT5Lia55qEIEVURiDln7rph5HlrprmipXlt6XlhbcnfVxuICAgIF0sXG4gICAgZWZmZWN0OiAnYmFjaycgLy9iYWNrfGRlbGV0ZXxqdW1wXG59XG5cbm5ldyBZYVR5cGUoJyNlbGVtZW50Jywgb3B0aW9uKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4YW1wbGUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZGVmYXVsdE9wdCA9IHtcbiAgICBsb29wOiB0cnVlLFxuICAgIGNoYXJUaW1lOiA2MDAsXG4gICAgbW92ZUJhY2tUaW1lOiAzMDAsXG4gICAgZGVsZXRlQmFja1RpbWU6IDMwMCxcbiAgICBqdW1wVGltZTogMzAwLFxuICAgIHNlbnRlbmNlUGF1c2VUaW1lOiAxMDAwXG59XG5cbmNsYXNzIFlhVHlwZSB7XG4gICAgY29uc3RydWN0b3IoZWwsIG9wdGlvbil7XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICAgICAgdGhpcy5vcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0LCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9wdGlvbikpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCA9IDA7ICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IoKTtcbiAgICAgICAgdGhpcy53YWxrKCk7XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yKCl7XG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb2luID0gMDtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+JztcbiAgICAgICAgdGhpcy5jdXJzb3JTdHlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlW25hbWU9XCJ5YXR5cGVcIl0nKSB8fCBnZW5lcmF0ZVN0eWxlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTdHlsZSgpe1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKSxcbiAgICAgICAgICAgICAgICBjc3MgPSBbXG4gICAgICAgICAgICAgICAgICAgICcueWF0eXBlX19jdXJzb3IgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29sb3I6IGJsYWNrOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZm9udC13ZWlnaHQ6IGJvbGRlcjsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZvbnQtc3R5bGU6IG5vcm1hbDsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FuaW1hdGlvbjogMXMgZmxhc2hpbmcgc3RlcC1lbmQgaW5maW5pdGU7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd9JyxcbiAgICAgICAgICAgICAgICAgICAgJ0BrZXlmcmFtZXMgZmxhc2hpbmcgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnMCUsIDEwMCUgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbG9yOiBibGFjazsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ30nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzUwJSB7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29sb3I6IHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd9JyxcbiAgICAgICAgICAgICAgICAgICAgJ30nXS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnbmFtZScsICd5YXR5cGUnKTtcbiAgICAgICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpe1xuICAgICAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdhbGsoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgc3RyaW5ncyA9IHNlbGYub3B0LnN0cmluZ3M7XG4gICAgICAgIGlmKHNlbGYuY3VycmVudENlbnRlbmNlSW5kZXggPT0gc3RyaW5ncy5sZW5ndGgpe1xuICAgICAgICAgICAgaWYoc2VsZi5vcHQubG9vcCl7XG4gICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50Q2VudGVuY2VJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHNlbGYub3B0LmVmZmVjdCkge1xuICAgICAgICAgICAgY2FzZSAnYmFjayc6XG4gICAgICAgICAgICAgICAgc2VsZi5tb3ZlQmFja0N1cnNvcigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUJhY2tDdXJzb3IoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2p1bXAnOlxuICAgICAgICAgICAgICAgIHNlbGYuanVtcEN1cnNvcigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBzZWxmLm1vdmVCYWNrQ3Vyc29yKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlQmFja0N1cnNvcigpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggPT0gMCl7XG4gICAgICAgICAgICBzZWxmLnR5cGluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW92ZUJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVCYWNrKCl7XG4gICAgICAgICAgICB2YXIgYXJyID0gc2VsZi5wcmV2U2VudGVuY2UoKS5zcGxpdCgnJyk7XG4gICAgICAgICAgICBhcnIuc3BsaWNlKHNlbGYuY3Vyc29yUG9zaXRpb2luLCAwLCAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+Jyk7XG4gICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IGFyci5qb2luKCcnKTtcbiAgICAgICAgICAgIGlmKHNlbGYuY3Vyc29yUG9zaXRpb2luICE9IHNlbGYuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnNvclBvc2l0aW9pbiAtPSAxXG4gICAgICAgICAgICAgICAgICAgIG1vdmVCYWNrKCk7XG4gICAgICAgICAgICAgICAgfSwgc2VsZi5vcHQubW92ZUJhY2tUaW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi50eXBpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFzdFNhbWVDaGFySW5kZXgoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcHJldkNvbnRlbnQgPSBzZWxmLnByZXZTZW50ZW5jZSgpO1xuICAgICAgICB2YXIgY3VyckNvbnRlbnQgPSBzZWxmLmN1cnJTZW50ZW5jZSgpO1xuICAgICAgICB2YXIgbGFzdFNhbWVDaGFySW5kZXggPSAwO1xuICAgICAgICB3aGlsZShcbiAgICAgICAgICAgICAgICBwcmV2Q29udGVudFtsYXN0U2FtZUNoYXJJbmRleF0gJiZcbiAgICAgICAgICAgICAgICBjdXJyQ29udGVudFtsYXN0U2FtZUNoYXJJbmRleF0gJiZcbiAgICAgICAgICAgICAgICBwcmV2Q29udGVudFtsYXN0U2FtZUNoYXJJbmRleF0gPT0gY3VyckNvbnRlbnRbbGFzdFNhbWVDaGFySW5kZXhdXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgbGFzdFNhbWVDaGFySW5kZXggKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RTYW1lQ2hhckluZGV4O1xuICAgIH1cblxuICAgIGRlbGV0ZUJhY2tDdXJzb3IoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4ID09IDApe1xuICAgICAgICAgICAgc2VsZi5kZWxldGVUeXBpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcmV2U2VudGVuY2VDb3B5ID0gc2VsZi5wcmV2U2VudGVuY2UoKTtcbiAgICAgICAgICAgIGRlbGV0ZUJhY2socHJldlNlbnRlbmNlQ29weSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWxldGVCYWNrKHNlbnRlbmNlVG9EZWxldGUpe1xuICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZW50ZW5jZVRvRGVsZXRlICsgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPic7XG4gICAgICAgICAgICBpZihzZWxmLmN1cnNvclBvc2l0aW9pbiAhPSBzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCkpe1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJzb3JQb3NpdGlvaW4gLT0gMVxuICAgICAgICAgICAgICAgICAgICBkZWxldGVCYWNrKHNlbnRlbmNlVG9EZWxldGUuc2xpY2UoMCxzZW50ZW5jZVRvRGVsZXRlLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgICAgICAgICB9LCBzZWxmLm9wdC5kZWxldGVCYWNrVGltZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlVHlwaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGp1bXBDdXJzb3IoKXtcbiAgICAgICAgLy9UT0RPXG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggIT0gMCl7XG4gICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5wcmV2U2VudGVuY2UoKS5zcGxpdCgnJyk7XG4gICAgICAgICAgICBhcnIuc3BsaWNlKHRoaXMuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSwgMCwgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPicpO1xuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSBhcnIuam9pbignJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50eXBpbmcoKTtcbiAgICB9XG5cbiAgICBwcmV2U2VudGVuY2UoKXtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHQuc3RyaW5nc1t0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4IC0gMV1bJ2NvbnRlbnQnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJTZW50ZW5jZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5vcHQuc3RyaW5nc1t0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4XVsnY29udGVudCddO1xuICAgIH1cblxuICAgIHR5cGluZygpe1xuICAgICAgICBsZXQgaW5kZXggPSAwLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBwcmV2Q29udGVudCA9IHRoaXMucHJldlNlbnRlbmNlKCksXG4gICAgICAgICAgICBjdXJyQ29udGVudCA9IHRoaXMuY3VyclNlbnRlbmNlKCksXG4gICAgICAgICAgICB7YlBhcnQsIG1QYXJ0LCBhUGFydH0gPSB0aGlzLnNwbGl0U2VudGVuY2UocHJldkNvbnRlbnQsIGN1cnJDb250ZW50KSxcbiAgICAgICAgICAgIGNoYXJzID0gbVBhcnQuc3BsaXQoJycpLFxuICAgICAgICAgICAgY3VyU3RyID0gJyc7XG4gICAgICAgIGZ1bmN0aW9uIHR5cGUoKXtcbiAgICAgICAgICAgIGlmKGluZGV4ID09IGNoYXJzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50Q2VudGVuY2VJbmRleCArPSAxO1xuICAgICAgICAgICAgICAgIHNlbGYud2FsaygpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1clN0ciArPSBjaGFyc1tpbmRleCsrXTtcbiAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5tb3ZlQ3Vyc29yKGJQYXJ0LGN1clN0ciwgYVBhcnQpO1xuICAgICAgICAgICAgc2V0VGltZW91dCh0eXBlLCBzZWxmLm9wdC5jaGFyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlKCk7XG4gICAgfVxuXG4gICAgZGVsZXRlVHlwaW5nKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGluZGV4ID0gMCwgXG4gICAgICAgICAgICBjdXJyQ29udGVudCA9IHRoaXMuY3VyclNlbnRlbmNlKCksXG4gICAgICAgICAgICBjaGFycyA9IGN1cnJDb250ZW50LnNsaWNlKHNlbGYuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSksXG4gICAgICAgICAgICBjdXJTdHIgPSBjdXJyQ29udGVudC5zbGljZSgwLCBzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCkpO1xuICAgICAgICBmdW5jdGlvbiB0eXBlKCl7XG4gICAgICAgICAgICBpZihpbmRleCA9PSBjaGFycy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudENlbnRlbmNlSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICBzZWxmLndhbGsoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJTdHIgKz0gY2hhcnNbaW5kZXgrK107XG4gICAgICAgICAgICBzZWxmLmN1cnNvclBvc2l0aW9pbiA9IGN1clN0ci5sZW5ndGg7XG4gICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IGN1clN0ciArICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nO1xuICAgICAgICAgICAgc2V0VGltZW91dCh0eXBlLCBzZWxmLm9wdC5jaGFyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlKCk7XG4gICAgfVxuXG4gICAgbW92ZUN1cnNvcihiUGFydCxjdXJTdHIsIGFQYXJ0KXtcbiAgICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvaW4gPSBiUGFydC5sZW5ndGggKyBjdXJTdHIubGVuZ3RoO1xuICAgICAgICByZXR1cm4gYlBhcnQgKyBjdXJTdHIgKyAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+JyArIGFQYXJ0O1xuICAgIH1cblxuICAgIHNwbGl0U2VudGVuY2UocHJldiwgY3VycmVudCl7XG4gICAgICAgIGlmKCFwcmV2KXtcbiAgICAgICAgICAgIHJldHVybiB7YlBhcnQ6ICcnLCBtUGFydDogY3VycmVudCwgYVBhcnQ6ICcnfTtcbiAgICAgICAgfVxuICAgICAgICBpZihwcmV2ID09IGN1cnJlbnQpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigndHdvIHNlbnRlbmNlIGlzIHRoZSBzYW1lJyk7XG4gICAgICAgICAgICByZXR1cm4ge2JQYXJ0OiBjdXJyZW50LCBtUGFydDogJycsIGFQYXJ0OiAnJ307XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5nZXRMYXN0U2FtZUNoYXJJbmRleCgpO1xuICAgICAgICBsZXQgYlBhcnQgPSBwcmV2LnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgbGV0IGFQYXJ0ID0gcHJldi5zbGljZShpbmRleCwgcHJldi5sZW5ndGgpO1xuICAgICAgICBsZXQgaW52ZXJzZUluZGV4ID0gY3VycmVudC5sYXN0SW5kZXhPZihhUGFydCk7XG4gICAgICAgIGxldCBtUGFydCA9IGN1cnJlbnQuc2xpY2UoaW5kZXgsIGludmVyc2VJbmRleCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge2JQYXJ0LG1QYXJ0LGFQYXJ0fVxuICAgIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IFlhVHlwZVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
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
	    effect: 'moveBack' //moveBack|deleteBack|jumpBack
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
	        this.currentCursorPosition = 0;
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
	        setTimeout(self[self.opt.effect + 'Mode'].bind(self), self.opt.sentencePauseTime);
	        // self[self.opt.effect + 'Mode']();
	    }
	
	    moveBackMode(){
	        var self = this;
	        if(this.currentCentenceIndex == 0){
	            self.typing();
	        } else {
	            moveBack();
	        }
	
	        function moveBack(){
	            var arr = self.prevSentence().split('');
	            arr.splice(self.currentCursorPosition, 0, '<i class="yatype__cursor">|</i>');
	            self.el.innerHTML = arr.join('');
	            if(self.currentCursorPosition != self.getLastSameCharIndex()){
	                setTimeout(function(){
	                    self.currentCursorPosition -= 1;
	                    moveBack();
	                }, self.opt.moveBackTime);
	            } else {
	                self.typing();
	            }
	
	        }
	    }
	
	    deleteBackMode(){
	        var self = this;
	        if(this.currentCentenceIndex == 0){
	            self.deleteTyping();
	        } else {
	            var prevSentence = self.prevSentence();
	            deleteBack(prevSentence);
	        }
	
	        function deleteBack(sentenceToDelete){
	            self.el.innerHTML = sentenceToDelete + '<i class="yatype__cursor">|</i>';
	            if(self.currentCursorPosition != self.getLastSameCharIndex()){
	                setTimeout(function(){
	                    self.currentCursorPosition -= 1
	                    deleteBack(sentenceToDelete.slice(0,sentenceToDelete.length - 1));
	                }, self.opt.deleteBackTime);
	            } else {
	                self.deleteTyping();
	            }
	
	        }
	    }
	
	    jumpBackMode(){
	        if(this.currentCentenceIndex != 0){
	            var arr = this.prevSentence().split('');
	            arr.splice(this.getLastSameCharIndex(), 0, '<i class="yatype__cursor">|</i>');
	            this.el.innerHTML = arr.join('');
	        }
	        this.typing();
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
	            {bPart, mPart, aPart} = splitSentence(prevContent, currContent),
	            chars = mPart.split(''),
	            curStr = '';
	
	        self.type(index, bPart, mPart, aPart);
	
	        function splitSentence(prev, current){
	            if(!prev){
	                return {bPart: '', mPart: current, aPart: ''};
	            }
	            if(prev == current){
	                console.error('two sentence is the same');
	                return {bPart: current, mPart: '', aPart: ''};
	            }
	            let index = self.getLastSameCharIndex();
	            let bPart = prev.slice(0, index);
	            let aPart = prev.slice(index, prev.length);
	            let inverseIndex = current.lastIndexOf(aPart);
	            let mPart = current.slice(index, inverseIndex);
	            
	            return {bPart,mPart,aPart}
	        }
	
	    }
	
	    deleteTyping(){
	        var self = this,
	            index = 0, 
	            currContent = this.currSentence(),
	            chars = currContent.slice(self.getLastSameCharIndex()),
	            curStr = currContent.slice(0, self.getLastSameCharIndex());
	
	        self.type(index, curStr, chars, '');
	    }
	
	    type(index, bPart, mPart, aPart){
	        let self = this;
	        if(index > mPart.length){
	            this.currentCentenceIndex += 1;
	            this.walk();
	            return;
	        }
	        this.el.innerHTML = this.moveCursor(bPart,mPart.substring(0, index++), aPart);
	        setTimeout(function(){
	            self.type(index, bPart,mPart, aPart);
	        }, this.opt.charTime);
	    }
	
	
	    moveCursor(bPart,curStr, aPart){
	        this.currentCursorPosition = bPart.length + curStr.length;
	        return bPart + curStr + '<i class="yatype__cursor">|</i>' + aPart;
	    }
	
	
	    
	};
	module.exports = YaType

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmNlOTgxYjBkMDRhMjI0Nzg1MGEiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUyxvQkFBb0I7QUFDN0IsVUFBUywyQkFBMkI7QUFDcEMsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSxnQzs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkMsdUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXNDO0FBQ3RDLHVDQUFzQztBQUN0Qyw4Q0FBNkM7QUFDN0MsNkNBQTRDO0FBQzVDLG1FQUFrRTtBQUNsRSwyQkFBMEI7QUFDMUIsMkNBQTBDO0FBQzFDLG9DQUFtQztBQUNuQywyQ0FBMEM7QUFDMUMsMkJBQTBCO0FBQzFCLCtCQUE4QjtBQUM5QjtBQUNBLDJCQUEwQjtBQUMxQix1QkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQixjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakIsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsb0JBQW9CO0FBQ2pDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFvQjtBQUNwQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBLHdCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZjZTk4MWIwZDA0YTIyNDc4NTBhIiwiY29uc3QgWWFUeXBlID0gcmVxdWlyZSgnLi4nKTtcblxubGV0IG9wdGlvbiA9IHtcbiAgICBzdHJpbmdzOiBbXG4gICAgICAgIHtjb250ZW50OiAn6L+Z5piv5LiA5qy+5a6a5oqV5bel5YW3J30sXG4gICAgICAgIHtjb250ZW50OiAn6L+Z5piv5LiA5qy+IEVURiDln7rph5HlrprmipXlt6XlhbcnfSxcbiAgICAgICAge2NvbnRlbnQ6ICfov5nmmK/kuIDmrL7kuI3lpKrkuJPkuJrnmoQgRVRGIOWfuumHkeWumuaKleW3peWFtyd9XG4gICAgXSxcbiAgICBlZmZlY3Q6ICdtb3ZlQmFjaycgLy9tb3ZlQmFja3xkZWxldGVCYWNrfGp1bXBCYWNrXG59XG5cbm5ldyBZYVR5cGUoJyNlbGVtZW50Jywgb3B0aW9uKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4YW1wbGUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZGVmYXVsdE9wdCA9IHtcbiAgICBsb29wOiB0cnVlLFxuICAgIGNoYXJUaW1lOiA2MDAsXG4gICAgbW92ZUJhY2tUaW1lOiAzMDAsXG4gICAgZGVsZXRlQmFja1RpbWU6IDMwMCxcbiAgICBqdW1wVGltZTogMzAwLFxuICAgIHNlbnRlbmNlUGF1c2VUaW1lOiAxMDAwXG59XG5cbmNsYXNzIFlhVHlwZSB7XG4gICAgY29uc3RydWN0b3IoZWwsIG9wdGlvbil7XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICAgICAgdGhpcy5vcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0LCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9wdGlvbikpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCA9IDA7ICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IoKTtcbiAgICAgICAgdGhpcy53YWxrKCk7XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yKCl7XG4gICAgICAgIHRoaXMuY3VycmVudEN1cnNvclBvc2l0aW9uID0gMDtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+JztcbiAgICAgICAgdGhpcy5jdXJzb3JTdHlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlW25hbWU9XCJ5YXR5cGVcIl0nKSB8fCBnZW5lcmF0ZVN0eWxlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTdHlsZSgpe1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKSxcbiAgICAgICAgICAgICAgICBjc3MgPSBbXG4gICAgICAgICAgICAgICAgICAgICcueWF0eXBlX19jdXJzb3IgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29sb3I6IGJsYWNrOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZm9udC13ZWlnaHQ6IGJvbGRlcjsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZvbnQtc3R5bGU6IG5vcm1hbDsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FuaW1hdGlvbjogMXMgZmxhc2hpbmcgc3RlcC1lbmQgaW5maW5pdGU7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd9JyxcbiAgICAgICAgICAgICAgICAgICAgJ0BrZXlmcmFtZXMgZmxhc2hpbmcgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnMCUsIDEwMCUgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbG9yOiBibGFjazsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ30nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzUwJSB7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29sb3I6IHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd9JyxcbiAgICAgICAgICAgICAgICAgICAgJ30nXS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnbmFtZScsICd5YXR5cGUnKTtcbiAgICAgICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpe1xuICAgICAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdhbGsoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgc3RyaW5ncyA9IHNlbGYub3B0LnN0cmluZ3M7XG4gICAgICAgIGlmKHNlbGYuY3VycmVudENlbnRlbmNlSW5kZXggPT0gc3RyaW5ncy5sZW5ndGgpe1xuICAgICAgICAgICAgaWYoc2VsZi5vcHQubG9vcCl7XG4gICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50Q2VudGVuY2VJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KHNlbGZbc2VsZi5vcHQuZWZmZWN0ICsgJ01vZGUnXS5iaW5kKHNlbGYpLCBzZWxmLm9wdC5zZW50ZW5jZVBhdXNlVGltZSk7XG4gICAgICAgIC8vIHNlbGZbc2VsZi5vcHQuZWZmZWN0ICsgJ01vZGUnXSgpO1xuICAgIH1cblxuICAgIG1vdmVCYWNrTW9kZSgpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggPT0gMCl7XG4gICAgICAgICAgICBzZWxmLnR5cGluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW92ZUJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVCYWNrKCl7XG4gICAgICAgICAgICB2YXIgYXJyID0gc2VsZi5wcmV2U2VudGVuY2UoKS5zcGxpdCgnJyk7XG4gICAgICAgICAgICBhcnIuc3BsaWNlKHNlbGYuY3VycmVudEN1cnNvclBvc2l0aW9uLCAwLCAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+Jyk7XG4gICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IGFyci5qb2luKCcnKTtcbiAgICAgICAgICAgIGlmKHNlbGYuY3VycmVudEN1cnNvclBvc2l0aW9uICE9IHNlbGYuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiAtPSAxO1xuICAgICAgICAgICAgICAgICAgICBtb3ZlQmFjaygpO1xuICAgICAgICAgICAgICAgIH0sIHNlbGYub3B0Lm1vdmVCYWNrVGltZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYudHlwaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlbGV0ZUJhY2tNb2RlKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYodGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCA9PSAwKXtcbiAgICAgICAgICAgIHNlbGYuZGVsZXRlVHlwaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcHJldlNlbnRlbmNlID0gc2VsZi5wcmV2U2VudGVuY2UoKTtcbiAgICAgICAgICAgIGRlbGV0ZUJhY2socHJldlNlbnRlbmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUJhY2soc2VudGVuY2VUb0RlbGV0ZSl7XG4gICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbnRlbmNlVG9EZWxldGUgKyAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+JztcbiAgICAgICAgICAgIGlmKHNlbGYuY3VycmVudEN1cnNvclBvc2l0aW9uICE9IHNlbGYuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiAtPSAxXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZUJhY2soc2VudGVuY2VUb0RlbGV0ZS5zbGljZSgwLHNlbnRlbmNlVG9EZWxldGUubGVuZ3RoIC0gMSkpO1xuICAgICAgICAgICAgICAgIH0sIHNlbGYub3B0LmRlbGV0ZUJhY2tUaW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVUeXBpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAganVtcEJhY2tNb2RlKCl7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggIT0gMCl7XG4gICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5wcmV2U2VudGVuY2UoKS5zcGxpdCgnJyk7XG4gICAgICAgICAgICBhcnIuc3BsaWNlKHRoaXMuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSwgMCwgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPicpO1xuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSBhcnIuam9pbignJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50eXBpbmcoKTtcbiAgICB9XG5cbiAgICBnZXRMYXN0U2FtZUNoYXJJbmRleCgpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcmV2Q29udGVudCA9IHNlbGYucHJldlNlbnRlbmNlKCk7XG4gICAgICAgIHZhciBjdXJyQ29udGVudCA9IHNlbGYuY3VyclNlbnRlbmNlKCk7XG4gICAgICAgIHZhciBsYXN0U2FtZUNoYXJJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlKFxuICAgICAgICAgICAgICAgIHByZXZDb250ZW50W2xhc3RTYW1lQ2hhckluZGV4XSAmJlxuICAgICAgICAgICAgICAgIGN1cnJDb250ZW50W2xhc3RTYW1lQ2hhckluZGV4XSAmJlxuICAgICAgICAgICAgICAgIHByZXZDb250ZW50W2xhc3RTYW1lQ2hhckluZGV4XSA9PSBjdXJyQ29udGVudFtsYXN0U2FtZUNoYXJJbmRleF1cbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICBsYXN0U2FtZUNoYXJJbmRleCArKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdFNhbWVDaGFySW5kZXg7XG4gICAgfVxuXG4gICAgcHJldlNlbnRlbmNlKCl7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0LnN0cmluZ3NbdGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCAtIDFdWydjb250ZW50J107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjdXJyU2VudGVuY2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0LnN0cmluZ3NbdGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleF1bJ2NvbnRlbnQnXTtcbiAgICB9XG5cbiAgICB0eXBpbmcoKXtcbiAgICAgICAgbGV0IGluZGV4ID0gMCxcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgcHJldkNvbnRlbnQgPSB0aGlzLnByZXZTZW50ZW5jZSgpLFxuICAgICAgICAgICAgY3VyckNvbnRlbnQgPSB0aGlzLmN1cnJTZW50ZW5jZSgpLFxuICAgICAgICAgICAge2JQYXJ0LCBtUGFydCwgYVBhcnR9ID0gc3BsaXRTZW50ZW5jZShwcmV2Q29udGVudCwgY3VyckNvbnRlbnQpLFxuICAgICAgICAgICAgY2hhcnMgPSBtUGFydC5zcGxpdCgnJyksXG4gICAgICAgICAgICBjdXJTdHIgPSAnJztcblxuICAgICAgICBzZWxmLnR5cGUoaW5kZXgsIGJQYXJ0LCBtUGFydCwgYVBhcnQpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNwbGl0U2VudGVuY2UocHJldiwgY3VycmVudCl7XG4gICAgICAgICAgICBpZighcHJldil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtiUGFydDogJycsIG1QYXJ0OiBjdXJyZW50LCBhUGFydDogJyd9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJldiA9PSBjdXJyZW50KXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCd0d28gc2VudGVuY2UgaXMgdGhlIHNhbWUnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge2JQYXJ0OiBjdXJyZW50LCBtUGFydDogJycsIGFQYXJ0OiAnJ307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCk7XG4gICAgICAgICAgICBsZXQgYlBhcnQgPSBwcmV2LnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgICAgIGxldCBhUGFydCA9IHByZXYuc2xpY2UoaW5kZXgsIHByZXYubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBpbnZlcnNlSW5kZXggPSBjdXJyZW50Lmxhc3RJbmRleE9mKGFQYXJ0KTtcbiAgICAgICAgICAgIGxldCBtUGFydCA9IGN1cnJlbnQuc2xpY2UoaW5kZXgsIGludmVyc2VJbmRleCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB7YlBhcnQsbVBhcnQsYVBhcnR9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGRlbGV0ZVR5cGluZygpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBpbmRleCA9IDAsIFxuICAgICAgICAgICAgY3VyckNvbnRlbnQgPSB0aGlzLmN1cnJTZW50ZW5jZSgpLFxuICAgICAgICAgICAgY2hhcnMgPSBjdXJyQ29udGVudC5zbGljZShzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCkpLFxuICAgICAgICAgICAgY3VyU3RyID0gY3VyckNvbnRlbnQuc2xpY2UoMCwgc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpKTtcblxuICAgICAgICBzZWxmLnR5cGUoaW5kZXgsIGN1clN0ciwgY2hhcnMsICcnKTtcbiAgICB9XG5cbiAgICB0eXBlKGluZGV4LCBiUGFydCwgbVBhcnQsIGFQYXJ0KXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZihpbmRleCA+IG1QYXJ0Lmxlbmd0aCl7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4ICs9IDE7XG4gICAgICAgICAgICB0aGlzLndhbGsoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMubW92ZUN1cnNvcihiUGFydCxtUGFydC5zdWJzdHJpbmcoMCwgaW5kZXgrKyksIGFQYXJ0KTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2VsZi50eXBlKGluZGV4LCBiUGFydCxtUGFydCwgYVBhcnQpO1xuICAgICAgICB9LCB0aGlzLm9wdC5jaGFyVGltZSk7XG4gICAgfVxuXG5cbiAgICBtb3ZlQ3Vyc29yKGJQYXJ0LGN1clN0ciwgYVBhcnQpe1xuICAgICAgICB0aGlzLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiA9IGJQYXJ0Lmxlbmd0aCArIGN1clN0ci5sZW5ndGg7XG4gICAgICAgIHJldHVybiBiUGFydCArIGN1clN0ciArICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nICsgYVBhcnQ7XG4gICAgfVxuXG5cbiAgICBcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFlhVHlwZVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
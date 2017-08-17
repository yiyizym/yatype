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
	    effect: 'jumpBack' //moveBack|deleteBack|jumpBack
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
	
	        self[self.opt.effect + 'Mode']();
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
	
	        type();
	
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
	
	        function type(){
	            if(index == chars.length){
	                self.currentCentenceIndex += 1;
	                self.walk();
	                return;
	            }
	            curStr += chars[index++];
	            self.el.innerHTML = moveCursor(bPart,curStr, aPart);
	            setTimeout(type, self.opt.charTime);
	        }
	
	        function moveCursor(bPart,curStr, aPart){
	            self.currentCursorPosition = bPart.length + curStr.length;
	            return bPart + curStr + '<i class="yatype__cursor">|</i>' + aPart;
	        }
	
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
	            self.currentCursorPosition = curStr.length;
	            self.el.innerHTML = curStr + '<i class="yatype__cursor">|</i>';
	            setTimeout(type, self.opt.charTime);
	        }
	
	        type();
	    }
	
	
	    
	};
	module.exports = YaType

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTMyZWM4ZmQwNzVlZmFmNjMyNzUiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUyxvQkFBb0I7QUFDN0IsVUFBUywyQkFBMkI7QUFDcEMsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSxnQzs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkMsdUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXNDO0FBQ3RDLHVDQUFzQztBQUN0Qyw4Q0FBNkM7QUFDN0MsNkNBQTRDO0FBQzVDLG1FQUFrRTtBQUNsRSwyQkFBMEI7QUFDMUIsMkNBQTBDO0FBQzFDLG9DQUFtQztBQUNuQywyQ0FBMEM7QUFDMUMsMkJBQTBCO0FBQzFCLCtCQUE4QjtBQUM5QjtBQUNBLDJCQUEwQjtBQUMxQix1QkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQixjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxvQkFBb0I7QUFDakM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7OztBQUlBO0FBQ0Esd0IiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTMyZWM4ZmQwNzVlZmFmNjMyNzUiLCJjb25zdCBZYVR5cGUgPSByZXF1aXJlKCcuLicpO1xuXG5sZXQgb3B0aW9uID0ge1xuICAgIHN0cmluZ3M6IFtcbiAgICAgICAge2NvbnRlbnQ6ICfov5nmmK/kuIDmrL7lrprmipXlt6XlhbcnfSxcbiAgICAgICAge2NvbnRlbnQ6ICfov5nmmK/kuIDmrL4gRVRGIOWfuumHkeWumuaKleW3peWFtyd9LFxuICAgICAgICB7Y29udGVudDogJ+i/meaYr+S4gOasvuS4jeWkquS4k+S4mueahCBFVEYg5Z+66YeR5a6a5oqV5bel5YW3J31cbiAgICBdLFxuICAgIGVmZmVjdDogJ2p1bXBCYWNrJyAvL21vdmVCYWNrfGRlbGV0ZUJhY2t8anVtcEJhY2tcbn1cblxubmV3IFlhVHlwZSgnI2VsZW1lbnQnLCBvcHRpb24pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXhhbXBsZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBkZWZhdWx0T3B0ID0ge1xuICAgIGxvb3A6IHRydWUsXG4gICAgY2hhclRpbWU6IDYwMCxcbiAgICBtb3ZlQmFja1RpbWU6IDMwMCxcbiAgICBkZWxldGVCYWNrVGltZTogMzAwLFxuICAgIGp1bXBUaW1lOiAzMDAsXG4gICAgc2VudGVuY2VQYXVzZVRpbWU6IDEwMDBcbn1cblxuY2xhc3MgWWFUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcihlbCwgb3B0aW9uKXtcbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgICAgICB0aGlzLm9wdCA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHQsIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3B0aW9uKSkpO1xuICAgICAgICB0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4ID0gMDsgICAgICAgIFxuICAgICAgICB0aGlzLnNldEN1cnNvcigpO1xuICAgICAgICB0aGlzLndhbGsoKTtcbiAgICB9XG5cbiAgICBzZXRDdXJzb3IoKXtcbiAgICAgICAgdGhpcy5jdXJyZW50Q3Vyc29yUG9zaXRpb24gPSAwO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9ICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nO1xuICAgICAgICB0aGlzLmN1cnNvclN0eWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3R5bGVbbmFtZT1cInlhdHlwZVwiXScpIHx8IGdlbmVyYXRlU3R5bGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVN0eWxlKCl7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgICAgICAgICAgICAgIGNzcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgJy55YXR5cGVfX2N1cnNvciB7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb2xvcjogYmxhY2s7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdmb250LXdlaWdodDogYm9sZGVyOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZm9udC1zdHlsZTogbm9ybWFsOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYW5pbWF0aW9uOiAxcyBmbGFzaGluZyBzdGVwLWVuZCBpbmZpbml0ZTsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ30nLFxuICAgICAgICAgICAgICAgICAgICAnQGtleWZyYW1lcyBmbGFzaGluZyB7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICcwJSwgMTAwJSB7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29sb3I6IGJsYWNrOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnNTAlIHsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xvcjogdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ30nLFxuICAgICAgICAgICAgICAgICAgICAnfSddLmpvaW4oJ1xcbicpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCduYW1lJywgJ3lhdHlwZScpO1xuICAgICAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCl7XG4gICAgICAgICAgICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2Fsaygpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBzdHJpbmdzID0gc2VsZi5vcHQuc3RyaW5ncztcbiAgICAgICAgaWYoc2VsZi5jdXJyZW50Q2VudGVuY2VJbmRleCA9PSBzdHJpbmdzLmxlbmd0aCl7XG4gICAgICAgICAgICBpZihzZWxmLm9wdC5sb29wKXtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRDZW50ZW5jZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLnNldEN1cnNvcigpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZltzZWxmLm9wdC5lZmZlY3QgKyAnTW9kZSddKCk7XG4gICAgfVxuXG4gICAgbW92ZUJhY2tNb2RlKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYodGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCA9PSAwKXtcbiAgICAgICAgICAgIHNlbGYudHlwaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb3ZlQmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW92ZUJhY2soKXtcbiAgICAgICAgICAgIHZhciBhcnIgPSBzZWxmLnByZXZTZW50ZW5jZSgpLnNwbGl0KCcnKTtcbiAgICAgICAgICAgIGFyci5zcGxpY2Uoc2VsZi5jdXJyZW50Q3Vyc29yUG9zaXRpb24sIDAsICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nKTtcbiAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gYXJyLmpvaW4oJycpO1xuICAgICAgICAgICAgaWYoc2VsZi5jdXJyZW50Q3Vyc29yUG9zaXRpb24gIT0gc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudEN1cnNvclBvc2l0aW9uIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVCYWNrKCk7XG4gICAgICAgICAgICAgICAgfSwgc2VsZi5vcHQubW92ZUJhY2tUaW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi50eXBpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlQmFja01vZGUoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4ID09IDApe1xuICAgICAgICAgICAgc2VsZi5kZWxldGVUeXBpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcmV2U2VudGVuY2UgPSBzZWxmLnByZXZTZW50ZW5jZSgpO1xuICAgICAgICAgICAgZGVsZXRlQmFjayhwcmV2U2VudGVuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlQmFjayhzZW50ZW5jZVRvRGVsZXRlKXtcbiAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VudGVuY2VUb0RlbGV0ZSArICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nO1xuICAgICAgICAgICAgaWYoc2VsZi5jdXJyZW50Q3Vyc29yUG9zaXRpb24gIT0gc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudEN1cnNvclBvc2l0aW9uIC09IDFcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlQmFjayhzZW50ZW5jZVRvRGVsZXRlLnNsaWNlKDAsc2VudGVuY2VUb0RlbGV0ZS5sZW5ndGggLSAxKSk7XG4gICAgICAgICAgICAgICAgfSwgc2VsZi5vcHQuZGVsZXRlQmFja1RpbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVR5cGluZygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBqdW1wQmFja01vZGUoKXtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCAhPSAwKXtcbiAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLnByZXZTZW50ZW5jZSgpLnNwbGl0KCcnKTtcbiAgICAgICAgICAgIGFyci5zcGxpY2UodGhpcy5nZXRMYXN0U2FtZUNoYXJJbmRleCgpLCAwLCAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+Jyk7XG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IGFyci5qb2luKCcnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnR5cGluZygpO1xuICAgIH1cblxuICAgIGdldExhc3RTYW1lQ2hhckluZGV4KCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHByZXZDb250ZW50ID0gc2VsZi5wcmV2U2VudGVuY2UoKTtcbiAgICAgICAgdmFyIGN1cnJDb250ZW50ID0gc2VsZi5jdXJyU2VudGVuY2UoKTtcbiAgICAgICAgdmFyIGxhc3RTYW1lQ2hhckluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUoXG4gICAgICAgICAgICAgICAgcHJldkNvbnRlbnRbbGFzdFNhbWVDaGFySW5kZXhdICYmXG4gICAgICAgICAgICAgICAgY3VyckNvbnRlbnRbbGFzdFNhbWVDaGFySW5kZXhdICYmXG4gICAgICAgICAgICAgICAgcHJldkNvbnRlbnRbbGFzdFNhbWVDaGFySW5kZXhdID09IGN1cnJDb250ZW50W2xhc3RTYW1lQ2hhckluZGV4XVxuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgIGxhc3RTYW1lQ2hhckluZGV4ICsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsYXN0U2FtZUNoYXJJbmRleDtcbiAgICB9XG5cbiAgICBwcmV2U2VudGVuY2UoKXtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHQuc3RyaW5nc1t0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4IC0gMV1bJ2NvbnRlbnQnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJTZW50ZW5jZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5vcHQuc3RyaW5nc1t0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4XVsnY29udGVudCddO1xuICAgIH1cblxuICAgIHR5cGluZygpe1xuICAgICAgICBsZXQgaW5kZXggPSAwLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBwcmV2Q29udGVudCA9IHRoaXMucHJldlNlbnRlbmNlKCksXG4gICAgICAgICAgICBjdXJyQ29udGVudCA9IHRoaXMuY3VyclNlbnRlbmNlKCksXG4gICAgICAgICAgICB7YlBhcnQsIG1QYXJ0LCBhUGFydH0gPSBzcGxpdFNlbnRlbmNlKHByZXZDb250ZW50LCBjdXJyQ29udGVudCksXG4gICAgICAgICAgICBjaGFycyA9IG1QYXJ0LnNwbGl0KCcnKSxcbiAgICAgICAgICAgIGN1clN0ciA9ICcnO1xuXG4gICAgICAgIHR5cGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBzcGxpdFNlbnRlbmNlKHByZXYsIGN1cnJlbnQpe1xuICAgICAgICAgICAgaWYoIXByZXYpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7YlBhcnQ6ICcnLCBtUGFydDogY3VycmVudCwgYVBhcnQ6ICcnfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByZXYgPT0gY3VycmVudCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndHdvIHNlbnRlbmNlIGlzIHRoZSBzYW1lJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtiUGFydDogY3VycmVudCwgbVBhcnQ6ICcnLCBhUGFydDogJyd9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpO1xuICAgICAgICAgICAgbGV0IGJQYXJ0ID0gcHJldi5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgICBsZXQgYVBhcnQgPSBwcmV2LnNsaWNlKGluZGV4LCBwcmV2Lmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgaW52ZXJzZUluZGV4ID0gY3VycmVudC5sYXN0SW5kZXhPZihhUGFydCk7XG4gICAgICAgICAgICBsZXQgbVBhcnQgPSBjdXJyZW50LnNsaWNlKGluZGV4LCBpbnZlcnNlSW5kZXgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge2JQYXJ0LG1QYXJ0LGFQYXJ0fVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdHlwZSgpe1xuICAgICAgICAgICAgaWYoaW5kZXggPT0gY2hhcnMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRDZW50ZW5jZUluZGV4ICs9IDE7XG4gICAgICAgICAgICAgICAgc2VsZi53YWxrKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyU3RyICs9IGNoYXJzW2luZGV4KytdO1xuICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBtb3ZlQ3Vyc29yKGJQYXJ0LGN1clN0ciwgYVBhcnQpO1xuICAgICAgICAgICAgc2V0VGltZW91dCh0eXBlLCBzZWxmLm9wdC5jaGFyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtb3ZlQ3Vyc29yKGJQYXJ0LGN1clN0ciwgYVBhcnQpe1xuICAgICAgICAgICAgc2VsZi5jdXJyZW50Q3Vyc29yUG9zaXRpb24gPSBiUGFydC5sZW5ndGggKyBjdXJTdHIubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGJQYXJ0ICsgY3VyU3RyICsgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPicgKyBhUGFydDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZGVsZXRlVHlwaW5nKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGluZGV4ID0gMCwgXG4gICAgICAgICAgICBjdXJyQ29udGVudCA9IHRoaXMuY3VyclNlbnRlbmNlKCksXG4gICAgICAgICAgICBjaGFycyA9IGN1cnJDb250ZW50LnNsaWNlKHNlbGYuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSksXG4gICAgICAgICAgICBjdXJTdHIgPSBjdXJyQ29udGVudC5zbGljZSgwLCBzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCkpO1xuICAgICAgICBmdW5jdGlvbiB0eXBlKCl7XG4gICAgICAgICAgICBpZihpbmRleCA9PSBjaGFycy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudENlbnRlbmNlSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICBzZWxmLndhbGsoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJTdHIgKz0gY2hhcnNbaW5kZXgrK107XG4gICAgICAgICAgICBzZWxmLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiA9IGN1clN0ci5sZW5ndGg7XG4gICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IGN1clN0ciArICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nO1xuICAgICAgICAgICAgc2V0VGltZW91dCh0eXBlLCBzZWxmLm9wdC5jaGFyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlKCk7XG4gICAgfVxuXG5cbiAgICBcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFlhVHlwZVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
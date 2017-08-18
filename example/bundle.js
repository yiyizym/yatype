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
	    effect: 'deleteBack' //moveBack|deleteBack|jumpBack
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
	        if(index == mPart.length){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDgzMGI1MGVlODNhNmRiZTMzZGMiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUyxvQkFBb0I7QUFDN0IsVUFBUywyQkFBMkI7QUFDcEMsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSxnQzs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkMsdUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXNDO0FBQ3RDLHVDQUFzQztBQUN0Qyw4Q0FBNkM7QUFDN0MsNkNBQTRDO0FBQzVDLG1FQUFrRTtBQUNsRSwyQkFBMEI7QUFDMUIsMkNBQTBDO0FBQzFDLG9DQUFtQztBQUNuQywyQ0FBMEM7QUFDMUMsMkJBQTBCO0FBQzFCLCtCQUE4QjtBQUM5QjtBQUNBLDJCQUEwQjtBQUMxQix1QkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQixjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxvQkFBb0I7QUFDakM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQW9CO0FBQ3BCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0Esd0IiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDgzMGI1MGVlODNhNmRiZTMzZGMiLCJjb25zdCBZYVR5cGUgPSByZXF1aXJlKCcuLicpO1xuXG5sZXQgb3B0aW9uID0ge1xuICAgIHN0cmluZ3M6IFtcbiAgICAgICAge2NvbnRlbnQ6ICfov5nmmK/kuIDmrL7lrprmipXlt6XlhbcnfSxcbiAgICAgICAge2NvbnRlbnQ6ICfov5nmmK/kuIDmrL4gRVRGIOWfuumHkeWumuaKleW3peWFtyd9LFxuICAgICAgICB7Y29udGVudDogJ+i/meaYr+S4gOasvuS4jeWkquS4k+S4mueahCBFVEYg5Z+66YeR5a6a5oqV5bel5YW3J31cbiAgICBdLFxuICAgIGVmZmVjdDogJ2RlbGV0ZUJhY2snIC8vbW92ZUJhY2t8ZGVsZXRlQmFja3xqdW1wQmFja1xufVxuXG5uZXcgWWFUeXBlKCcjZWxlbWVudCcsIG9wdGlvbik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leGFtcGxlL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGRlZmF1bHRPcHQgPSB7XG4gICAgbG9vcDogdHJ1ZSxcbiAgICBjaGFyVGltZTogNjAwLFxuICAgIG1vdmVCYWNrVGltZTogMzAwLFxuICAgIGRlbGV0ZUJhY2tUaW1lOiAzMDAsXG4gICAganVtcFRpbWU6IDMwMCxcbiAgICBzZW50ZW5jZVBhdXNlVGltZTogMTAwMFxufVxuXG5jbGFzcyBZYVR5cGUge1xuICAgIGNvbnN0cnVjdG9yKGVsLCBvcHRpb24pe1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgICAgIHRoaXMub3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdCwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcHRpb24pKSk7XG4gICAgICAgIHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggPSAwOyAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yKCk7XG4gICAgICAgIHRoaXMud2FsaygpO1xuICAgIH1cblxuICAgIHNldEN1cnNvcigpe1xuICAgICAgICB0aGlzLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiA9IDA7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPic7XG4gICAgICAgIHRoaXMuY3Vyc29yU3R5bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZVtuYW1lPVwieWF0eXBlXCJdJykgfHwgZ2VuZXJhdGVTdHlsZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU3R5bGUoKXtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyksXG4gICAgICAgICAgICAgICAgY3NzID0gW1xuICAgICAgICAgICAgICAgICAgICAnLnlhdHlwZV9fY3Vyc29yIHsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbG9yOiBibGFjazsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0OiBib2xkZXI7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdmb250LXN0eWxlOiBub3JtYWw7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhbmltYXRpb246IDFzIGZsYXNoaW5nIHN0ZXAtZW5kIGluZmluaXRlOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnfScsXG4gICAgICAgICAgICAgICAgICAgICdAa2V5ZnJhbWVzIGZsYXNoaW5nIHsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzAlLCAxMDAlIHsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xvcjogYmxhY2s7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc1MCUgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbG9yOiB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnfScsXG4gICAgICAgICAgICAgICAgICAgICd9J10uam9pbignXFxuJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAneWF0eXBlJyk7XG4gICAgICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KXtcbiAgICAgICAgICAgICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3YWxrKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHN0cmluZ3MgPSBzZWxmLm9wdC5zdHJpbmdzO1xuICAgICAgICBpZihzZWxmLmN1cnJlbnRDZW50ZW5jZUluZGV4ID09IHN0cmluZ3MubGVuZ3RoKXtcbiAgICAgICAgICAgIGlmKHNlbGYub3B0Lmxvb3Ape1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudENlbnRlbmNlSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2V0Q3Vyc29yKCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmW3NlbGYub3B0LmVmZmVjdCArICdNb2RlJ10oKTtcbiAgICB9XG5cbiAgICBtb3ZlQmFja01vZGUoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4ID09IDApe1xuICAgICAgICAgICAgc2VsZi50eXBpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vdmVCYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtb3ZlQmFjaygpe1xuICAgICAgICAgICAgdmFyIGFyciA9IHNlbGYucHJldlNlbnRlbmNlKCkuc3BsaXQoJycpO1xuICAgICAgICAgICAgYXJyLnNwbGljZShzZWxmLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiwgMCwgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPicpO1xuICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBhcnIuam9pbignJyk7XG4gICAgICAgICAgICBpZihzZWxmLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiAhPSBzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCkpe1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50Q3Vyc29yUG9zaXRpb24gLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgbW92ZUJhY2soKTtcbiAgICAgICAgICAgICAgICB9LCBzZWxmLm9wdC5tb3ZlQmFja1RpbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLnR5cGluZygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVCYWNrTW9kZSgpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggPT0gMCl7XG4gICAgICAgICAgICBzZWxmLmRlbGV0ZVR5cGluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHByZXZTZW50ZW5jZSA9IHNlbGYucHJldlNlbnRlbmNlKCk7XG4gICAgICAgICAgICBkZWxldGVCYWNrKHByZXZTZW50ZW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWxldGVCYWNrKHNlbnRlbmNlVG9EZWxldGUpe1xuICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZW50ZW5jZVRvRGVsZXRlICsgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPic7XG4gICAgICAgICAgICBpZihzZWxmLmN1cnJlbnRDdXJzb3JQb3NpdGlvbiAhPSBzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCkpe1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50Q3Vyc29yUG9zaXRpb24gLT0gMVxuICAgICAgICAgICAgICAgICAgICBkZWxldGVCYWNrKHNlbnRlbmNlVG9EZWxldGUuc2xpY2UoMCxzZW50ZW5jZVRvRGVsZXRlLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgICAgICAgICB9LCBzZWxmLm9wdC5kZWxldGVCYWNrVGltZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlVHlwaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGp1bXBCYWNrTW9kZSgpe1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4ICE9IDApe1xuICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMucHJldlNlbnRlbmNlKCkuc3BsaXQoJycpO1xuICAgICAgICAgICAgYXJyLnNwbGljZSh0aGlzLmdldExhc3RTYW1lQ2hhckluZGV4KCksIDAsICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nKTtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gYXJyLmpvaW4oJycpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHlwaW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0TGFzdFNhbWVDaGFySW5kZXgoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcHJldkNvbnRlbnQgPSBzZWxmLnByZXZTZW50ZW5jZSgpO1xuICAgICAgICB2YXIgY3VyckNvbnRlbnQgPSBzZWxmLmN1cnJTZW50ZW5jZSgpO1xuICAgICAgICB2YXIgbGFzdFNhbWVDaGFySW5kZXggPSAwO1xuICAgICAgICB3aGlsZShcbiAgICAgICAgICAgICAgICBwcmV2Q29udGVudFtsYXN0U2FtZUNoYXJJbmRleF0gJiZcbiAgICAgICAgICAgICAgICBjdXJyQ29udGVudFtsYXN0U2FtZUNoYXJJbmRleF0gJiZcbiAgICAgICAgICAgICAgICBwcmV2Q29udGVudFtsYXN0U2FtZUNoYXJJbmRleF0gPT0gY3VyckNvbnRlbnRbbGFzdFNhbWVDaGFySW5kZXhdXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgbGFzdFNhbWVDaGFySW5kZXggKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RTYW1lQ2hhckluZGV4O1xuICAgIH1cblxuICAgIHByZXZTZW50ZW5jZSgpe1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRDZW50ZW5jZUluZGV4KXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdC5zdHJpbmdzW3RoaXMuY3VycmVudENlbnRlbmNlSW5kZXggLSAxXVsnY29udGVudCddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3VyclNlbnRlbmNlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdC5zdHJpbmdzW3RoaXMuY3VycmVudENlbnRlbmNlSW5kZXhdWydjb250ZW50J107XG4gICAgfVxuXG4gICAgdHlwaW5nKCl7XG4gICAgICAgIGxldCBpbmRleCA9IDAsXG4gICAgICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHByZXZDb250ZW50ID0gdGhpcy5wcmV2U2VudGVuY2UoKSxcbiAgICAgICAgICAgIGN1cnJDb250ZW50ID0gdGhpcy5jdXJyU2VudGVuY2UoKSxcbiAgICAgICAgICAgIHtiUGFydCwgbVBhcnQsIGFQYXJ0fSA9IHNwbGl0U2VudGVuY2UocHJldkNvbnRlbnQsIGN1cnJDb250ZW50KSxcbiAgICAgICAgICAgIGNoYXJzID0gbVBhcnQuc3BsaXQoJycpLFxuICAgICAgICAgICAgY3VyU3RyID0gJyc7XG5cbiAgICAgICAgc2VsZi50eXBlKGluZGV4LCBiUGFydCwgbVBhcnQsIGFQYXJ0KTtcblxuICAgICAgICBmdW5jdGlvbiBzcGxpdFNlbnRlbmNlKHByZXYsIGN1cnJlbnQpe1xuICAgICAgICAgICAgaWYoIXByZXYpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7YlBhcnQ6ICcnLCBtUGFydDogY3VycmVudCwgYVBhcnQ6ICcnfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByZXYgPT0gY3VycmVudCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndHdvIHNlbnRlbmNlIGlzIHRoZSBzYW1lJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtiUGFydDogY3VycmVudCwgbVBhcnQ6ICcnLCBhUGFydDogJyd9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpO1xuICAgICAgICAgICAgbGV0IGJQYXJ0ID0gcHJldi5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgICBsZXQgYVBhcnQgPSBwcmV2LnNsaWNlKGluZGV4LCBwcmV2Lmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgaW52ZXJzZUluZGV4ID0gY3VycmVudC5sYXN0SW5kZXhPZihhUGFydCk7XG4gICAgICAgICAgICBsZXQgbVBhcnQgPSBjdXJyZW50LnNsaWNlKGluZGV4LCBpbnZlcnNlSW5kZXgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge2JQYXJ0LG1QYXJ0LGFQYXJ0fVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBkZWxldGVUeXBpbmcoKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgaW5kZXggPSAwLCBcbiAgICAgICAgICAgIGN1cnJDb250ZW50ID0gdGhpcy5jdXJyU2VudGVuY2UoKSxcbiAgICAgICAgICAgIGNoYXJzID0gY3VyckNvbnRlbnQuc2xpY2Uoc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpKSxcbiAgICAgICAgICAgIGN1clN0ciA9IGN1cnJDb250ZW50LnNsaWNlKDAsIHNlbGYuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSk7XG5cbiAgICAgICAgc2VsZi50eXBlKGluZGV4LCBjdXJTdHIsIGNoYXJzLCAnJyk7XG4gICAgfVxuXG4gICAgdHlwZShpbmRleCwgYlBhcnQsIG1QYXJ0LCBhUGFydCl7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYoaW5kZXggPT0gbVBhcnQubGVuZ3RoKXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggKz0gMTtcbiAgICAgICAgICAgIHRoaXMud2FsaygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5tb3ZlQ3Vyc29yKGJQYXJ0LG1QYXJ0LnN1YnN0cmluZygwLCBpbmRleCsrKSwgYVBhcnQpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzZWxmLnR5cGUoaW5kZXgsIGJQYXJ0LG1QYXJ0LCBhUGFydCk7XG4gICAgICAgIH0sIHRoaXMub3B0LmNoYXJUaW1lKTtcbiAgICB9XG5cblxuICAgIG1vdmVDdXJzb3IoYlBhcnQsY3VyU3RyLCBhUGFydCl7XG4gICAgICAgIHRoaXMuY3VycmVudEN1cnNvclBvc2l0aW9uID0gYlBhcnQubGVuZ3RoICsgY3VyU3RyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGJQYXJ0ICsgY3VyU3RyICsgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPicgKyBhUGFydDtcbiAgICB9XG5cblxuICAgIFxufTtcbm1vZHVsZS5leHBvcnRzID0gWWFUeXBlXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9
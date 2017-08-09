/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const defaultOpt = {
    loop: true,
    charTime: 600,
    moveBackTime: 300,
    deleteBackTime: 300,
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
}

let option = {
    strings: [
        {content: '这是一款定投工具'},
        {content: '这是一款 ETF 基金定投工具'},
        {content: '这是一款不太专业的 ETF 基金定投工具'}
    ],
    effect: 'delete' //back|delete|jump
}

new YaType('#element', option);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWVkM2Q0N2I5NWJmNzk0NWE3ODciLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkMsc0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDLHNDQUFzQztBQUN0Qyw2Q0FBNkM7QUFDN0MsNENBQTRDO0FBQzVDLGtFQUFrRTtBQUNsRSwwQkFBMEI7QUFDMUIsMENBQTBDO0FBQzFDLG1DQUFtQztBQUNuQywwQ0FBMEM7QUFDMUMsMEJBQTBCO0FBQzFCLDhCQUE4QjtBQUM5QjtBQUNBLDBCQUEwQjtBQUMxQixzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxvQkFBb0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUywyQkFBMkI7QUFDcEMsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSwrQiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFlZDNkNDdiOTViZjc5NDVhNzg3IiwiY29uc3QgZGVmYXVsdE9wdCA9IHtcbiAgICBsb29wOiB0cnVlLFxuICAgIGNoYXJUaW1lOiA2MDAsXG4gICAgbW92ZUJhY2tUaW1lOiAzMDAsXG4gICAgZGVsZXRlQmFja1RpbWU6IDMwMCxcbiAgICBzZW50ZW5jZVBhdXNlVGltZTogMTAwMFxufVxuXG5jbGFzcyBZYVR5cGUge1xuICAgIGNvbnN0cnVjdG9yKGVsLCBvcHRpb24pe1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgICAgIHRoaXMub3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdCwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcHRpb24pKSk7XG4gICAgICAgIHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggPSAwOyAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yKCk7XG4gICAgICAgIHRoaXMud2FsaygpO1xuICAgIH1cblxuICAgIHNldEN1cnNvcigpe1xuICAgICAgICB0aGlzLmN1cnNvclBvc2l0aW9pbiA9IDA7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPic7XG4gICAgICAgIHRoaXMuY3Vyc29yU3R5bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZVtuYW1lPVwieWF0eXBlXCJdJykgfHwgZ2VuZXJhdGVTdHlsZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU3R5bGUoKXtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyksXG4gICAgICAgICAgICAgICAgY3NzID0gW1xuICAgICAgICAgICAgICAgICAgICAnLnlhdHlwZV9fY3Vyc29yIHsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbG9yOiBibGFjazsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0OiBib2xkZXI7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdmb250LXN0eWxlOiBub3JtYWw7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhbmltYXRpb246IDFzIGZsYXNoaW5nIHN0ZXAtZW5kIGluZmluaXRlOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnfScsXG4gICAgICAgICAgICAgICAgICAgICdAa2V5ZnJhbWVzIGZsYXNoaW5nIHsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzAlLCAxMDAlIHsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xvcjogYmxhY2s7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc1MCUgeycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbG9yOiB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnfScsXG4gICAgICAgICAgICAgICAgICAgICd9J10uam9pbignXFxuJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAneWF0eXBlJyk7XG4gICAgICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KXtcbiAgICAgICAgICAgICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3YWxrKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHN0cmluZ3MgPSBzZWxmLm9wdC5zdHJpbmdzO1xuICAgICAgICBpZihzZWxmLmN1cnJlbnRDZW50ZW5jZUluZGV4ID09IHN0cmluZ3MubGVuZ3RoKXtcbiAgICAgICAgICAgIGlmKHNlbGYub3B0Lmxvb3Ape1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudENlbnRlbmNlSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2V0Q3Vyc29yKCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChzZWxmLm9wdC5lZmZlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgJ2JhY2snOlxuICAgICAgICAgICAgICAgIHNlbGYubW92ZUJhY2tDdXJzb3IoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVCYWNrQ3Vyc29yKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHNlbGYubW92ZUJhY2tDdXJzb3IoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVCYWNrQ3Vyc29yKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYodGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCA9PSAwKXtcbiAgICAgICAgICAgIHNlbGYudHlwaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb3ZlQmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW92ZUJhY2soKXtcbiAgICAgICAgICAgIHZhciBhcnIgPSBzZWxmLnByZXZTZW50ZW5jZSgpLnNwbGl0KCcnKTtcbiAgICAgICAgICAgIGFyci5zcGxpY2Uoc2VsZi5jdXJzb3JQb3NpdGlvaW4sIDAsICc8aSBjbGFzcz1cInlhdHlwZV9fY3Vyc29yXCI+fDwvaT4nKTtcbiAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gYXJyLmpvaW4oJycpO1xuICAgICAgICAgICAgaWYoc2VsZi5jdXJzb3JQb3NpdGlvaW4gIT0gc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3Vyc29yUG9zaXRpb2luIC09IDFcbiAgICAgICAgICAgICAgICAgICAgbW92ZUJhY2soKTtcbiAgICAgICAgICAgICAgICB9LCBzZWxmLm9wdC5tb3ZlQmFja1RpbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLnR5cGluZygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYXN0U2FtZUNoYXJJbmRleCgpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcmV2Q29udGVudCA9IHNlbGYucHJldlNlbnRlbmNlKCk7XG4gICAgICAgIHZhciBjdXJyQ29udGVudCA9IHNlbGYuY3VyclNlbnRlbmNlKCk7XG4gICAgICAgIHZhciBsYXN0U2FtZUNoYXJJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlKFxuICAgICAgICAgICAgICAgIHByZXZDb250ZW50W2xhc3RTYW1lQ2hhckluZGV4XSAmJlxuICAgICAgICAgICAgICAgIGN1cnJDb250ZW50W2xhc3RTYW1lQ2hhckluZGV4XSAmJlxuICAgICAgICAgICAgICAgIHByZXZDb250ZW50W2xhc3RTYW1lQ2hhckluZGV4XSA9PSBjdXJyQ29udGVudFtsYXN0U2FtZUNoYXJJbmRleF1cbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICBsYXN0U2FtZUNoYXJJbmRleCArKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdFNhbWVDaGFySW5kZXg7XG4gICAgfVxuXG4gICAgZGVsZXRlQmFja0N1cnNvcigpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXggPT0gMCl7XG4gICAgICAgICAgICBzZWxmLmRlbGV0ZVR5cGluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHByZXZTZW50ZW5jZUNvcHkgPSBzZWxmLnByZXZTZW50ZW5jZSgpO1xuICAgICAgICAgICAgZGVsZXRlQmFjayhwcmV2U2VudGVuY2VDb3B5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUJhY2soc2VudGVuY2VUb0RlbGV0ZSl7XG4gICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbnRlbmNlVG9EZWxldGUgKyAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+JztcbiAgICAgICAgICAgIGlmKHNlbGYuY3Vyc29yUG9zaXRpb2luICE9IHNlbGYuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKSl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnNvclBvc2l0aW9pbiAtPSAxXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZUJhY2soc2VudGVuY2VUb0RlbGV0ZS5zbGljZSgwLHNlbnRlbmNlVG9EZWxldGUubGVuZ3RoIC0gMSkpO1xuICAgICAgICAgICAgICAgIH0sIHNlbGYub3B0LmRlbGV0ZUJhY2tUaW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVUeXBpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJldlNlbnRlbmNlKCl7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENlbnRlbmNlSW5kZXgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0LnN0cmluZ3NbdGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleCAtIDFdWydjb250ZW50J107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjdXJyU2VudGVuY2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0LnN0cmluZ3NbdGhpcy5jdXJyZW50Q2VudGVuY2VJbmRleF1bJ2NvbnRlbnQnXTtcbiAgICB9XG5cbiAgICB0eXBpbmcoKXtcbiAgICAgICAgbGV0IGluZGV4ID0gMCxcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgcHJldkNvbnRlbnQgPSB0aGlzLnByZXZTZW50ZW5jZSgpLFxuICAgICAgICAgICAgY3VyckNvbnRlbnQgPSB0aGlzLmN1cnJTZW50ZW5jZSgpLFxuICAgICAgICAgICAge2JQYXJ0LCBtUGFydCwgYVBhcnR9ID0gdGhpcy5zcGxpdFNlbnRlbmNlKHByZXZDb250ZW50LCBjdXJyQ29udGVudCksXG4gICAgICAgICAgICBjaGFycyA9IG1QYXJ0LnNwbGl0KCcnKSxcbiAgICAgICAgICAgIGN1clN0ciA9ICcnO1xuICAgICAgICBmdW5jdGlvbiB0eXBlKCl7XG4gICAgICAgICAgICBpZihpbmRleCA9PSBjaGFycy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudENlbnRlbmNlSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICBzZWxmLndhbGsoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJTdHIgKz0gY2hhcnNbaW5kZXgrK107XG4gICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYubW92ZUN1cnNvcihiUGFydCxjdXJTdHIsIGFQYXJ0KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQodHlwZSwgc2VsZi5vcHQuY2hhclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSgpO1xuICAgIH1cblxuICAgIGRlbGV0ZVR5cGluZygpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBpbmRleCA9IDAsIFxuICAgICAgICAgICAgY3VyckNvbnRlbnQgPSB0aGlzLmN1cnJTZW50ZW5jZSgpLFxuICAgICAgICAgICAgY2hhcnMgPSBjdXJyQ29udGVudC5zbGljZShzZWxmLmdldExhc3RTYW1lQ2hhckluZGV4KCkpLFxuICAgICAgICAgICAgY3VyU3RyID0gY3VyckNvbnRlbnQuc2xpY2UoMCwgc2VsZi5nZXRMYXN0U2FtZUNoYXJJbmRleCgpKTtcbiAgICAgICAgZnVuY3Rpb24gdHlwZSgpe1xuICAgICAgICAgICAgaWYoaW5kZXggPT0gY2hhcnMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRDZW50ZW5jZUluZGV4ICs9IDE7XG4gICAgICAgICAgICAgICAgc2VsZi53YWxrKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyU3RyICs9IGNoYXJzW2luZGV4KytdO1xuICAgICAgICAgICAgc2VsZi5jdXJzb3JQb3NpdGlvaW4gPSBjdXJTdHIubGVuZ3RoO1xuICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBjdXJTdHIgKyAnPGkgY2xhc3M9XCJ5YXR5cGVfX2N1cnNvclwiPnw8L2k+JztcbiAgICAgICAgICAgIHNldFRpbWVvdXQodHlwZSwgc2VsZi5vcHQuY2hhclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSgpO1xuICAgIH1cblxuICAgIG1vdmVDdXJzb3IoYlBhcnQsY3VyU3RyLCBhUGFydCl7XG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb2luID0gYlBhcnQubGVuZ3RoICsgY3VyU3RyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGJQYXJ0ICsgY3VyU3RyICsgJzxpIGNsYXNzPVwieWF0eXBlX19jdXJzb3JcIj58PC9pPicgKyBhUGFydDtcbiAgICB9XG5cbiAgICBzcGxpdFNlbnRlbmNlKHByZXYsIGN1cnJlbnQpe1xuICAgICAgICBpZighcHJldil7XG4gICAgICAgICAgICByZXR1cm4ge2JQYXJ0OiAnJywgbVBhcnQ6IGN1cnJlbnQsIGFQYXJ0OiAnJ307XG4gICAgICAgIH1cbiAgICAgICAgaWYocHJldiA9PSBjdXJyZW50KXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3R3byBzZW50ZW5jZSBpcyB0aGUgc2FtZScpO1xuICAgICAgICAgICAgcmV0dXJuIHtiUGFydDogY3VycmVudCwgbVBhcnQ6ICcnLCBhUGFydDogJyd9O1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0TGFzdFNhbWVDaGFySW5kZXgoKTtcbiAgICAgICAgbGV0IGJQYXJ0ID0gcHJldi5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgIGxldCBhUGFydCA9IHByZXYuc2xpY2UoaW5kZXgsIHByZXYubGVuZ3RoKTtcbiAgICAgICAgbGV0IGludmVyc2VJbmRleCA9IGN1cnJlbnQubGFzdEluZGV4T2YoYVBhcnQpO1xuICAgICAgICBsZXQgbVBhcnQgPSBjdXJyZW50LnNsaWNlKGluZGV4LCBpbnZlcnNlSW5kZXgpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtiUGFydCxtUGFydCxhUGFydH1cbiAgICB9XG59XG5cbmxldCBvcHRpb24gPSB7XG4gICAgc3RyaW5nczogW1xuICAgICAgICB7Y29udGVudDogJ+i/meaYr+S4gOasvuWumuaKleW3peWFtyd9LFxuICAgICAgICB7Y29udGVudDogJ+i/meaYr+S4gOasviBFVEYg5Z+66YeR5a6a5oqV5bel5YW3J30sXG4gICAgICAgIHtjb250ZW50OiAn6L+Z5piv5LiA5qy+5LiN5aSq5LiT5Lia55qEIEVURiDln7rph5HlrprmipXlt6XlhbcnfVxuICAgIF0sXG4gICAgZWZmZWN0OiAnZGVsZXRlJyAvL2JhY2t8ZGVsZXRlfGp1bXBcbn1cblxubmV3IFlhVHlwZSgnI2VsZW1lbnQnLCBvcHRpb24pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=
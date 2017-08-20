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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var YaType = __webpack_require__(1);

var option = {
    strings: [{ content: '这是一款定投工具' }, { content: '这是一款 ETF 基金定投工具' }, { content: '这是一款不太专业的 ETF 基金定投工具' }],
    effect: 'jumpBack' //moveBack|deleteBack|jumpBack
};

new YaType('#element', option);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOpt = {
    loop: true,
    charTime: 600,
    moveBackTime: 300,
    deleteBackTime: 300,
    jumpTime: 300,
    sentencePauseTime: 1000
};

var YaType = function () {
    function YaType(el, option) {
        _classCallCheck(this, YaType);

        this.el = document.querySelector(el);
        this.opt = Object.assign({}, defaultOpt, JSON.parse(JSON.stringify(option)));
        this.currentCentenceIndex = 0;
        this.setCursor();
        this.walk();
    }

    _createClass(YaType, [{
        key: 'setCursor',
        value: function setCursor() {
            this.currentCursorPosition = 0;
            this.el.innerHTML = '<i class="yatype__cursor">|</i>';
            this.cursorStyle = document.querySelector('style[name="yatype"]') || generateStyle();

            function generateStyle() {
                var style = document.createElement('style'),
                    css = ['.yatype__cursor {', 'color: black;', 'font-weight: bolder;', 'font-style: normal;', 'animation: 1s flashing step-end infinite;', '}', '@keyframes flashing {', '0%, 100% {', 'color: black;', '}', '50% {', 'color: transparent', '}', '}'].join('\n');

                style.setAttribute('name', 'yatype');
                style.type = 'text/css';
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                document.head.appendChild(style);
            }
        }
    }, {
        key: 'walk',
        value: function walk() {
            var self = this,
                strings = self.opt.strings;
            if (self.currentCentenceIndex == strings.length) {
                if (self.opt.loop) {
                    self.currentCentenceIndex = 0;
                    self.setCursor();
                } else {
                    return;
                }
            }
            setTimeout(self[self.opt.effect + 'Mode'].bind(self), self.opt.sentencePauseTime);
        }
    }, {
        key: 'moveBackMode',
        value: function moveBackMode() {
            var self = this;
            if (this.currentCentenceIndex == 0) {
                self.typing();
            } else {
                moveBack();
            }

            function moveBack() {
                var arr = self.prevSentence().split('');
                arr.splice(self.currentCursorPosition, 0, '<i class="yatype__cursor">|</i>');
                self.el.innerHTML = arr.join('');
                if (self.currentCursorPosition != self.getLastSameCharIndex()) {
                    setTimeout(function () {
                        self.currentCursorPosition -= 1;
                        moveBack();
                    }, self.opt.moveBackTime);
                } else {
                    self.typing();
                }
            }
        }
    }, {
        key: 'deleteBackMode',
        value: function deleteBackMode() {
            var self = this;
            if (this.currentCentenceIndex == 0) {
                self.deleteTyping();
            } else {
                var prevSentence = self.prevSentence();
                deleteBack(prevSentence);
            }

            function deleteBack(sentenceToDelete) {
                self.el.innerHTML = sentenceToDelete + '<i class="yatype__cursor">|</i>';
                if (self.currentCursorPosition != self.getLastSameCharIndex()) {
                    setTimeout(function () {
                        self.currentCursorPosition -= 1;
                        deleteBack(sentenceToDelete.slice(0, sentenceToDelete.length - 1));
                    }, self.opt.deleteBackTime);
                } else {
                    self.deleteTyping();
                }
            }
        }
    }, {
        key: 'jumpBackMode',
        value: function jumpBackMode() {
            if (this.currentCentenceIndex != 0) {
                var arr = this.prevSentence().split('');
                arr.splice(this.getLastSameCharIndex(), 0, '<i class="yatype__cursor">|</i>');
                this.el.innerHTML = arr.join('');
            }
            this.typing();
        }
    }, {
        key: 'getLastSameCharIndex',
        value: function getLastSameCharIndex() {
            var self = this;
            var prevContent = self.prevSentence();
            var currContent = self.currSentence();
            var lastSameCharIndex = 0;
            while (prevContent[lastSameCharIndex] && currContent[lastSameCharIndex] && prevContent[lastSameCharIndex] == currContent[lastSameCharIndex]) {
                lastSameCharIndex++;
            }
            return lastSameCharIndex;
        }
    }, {
        key: 'prevSentence',
        value: function prevSentence() {
            if (this.currentCentenceIndex) {
                return this.opt.strings[this.currentCentenceIndex - 1]['content'];
            } else {
                return '';
            }
        }
    }, {
        key: 'currSentence',
        value: function currSentence() {
            return this.opt.strings[this.currentCentenceIndex]['content'];
        }
    }, {
        key: 'typing',
        value: function typing() {
            var index = 0,
                self = this,
                prevContent = this.prevSentence(),
                currContent = this.currSentence(),
                _splitSentence = splitSentence(prevContent, currContent),
                bPart = _splitSentence.bPart,
                mPart = _splitSentence.mPart,
                aPart = _splitSentence.aPart,
                chars = mPart.split(''),
                curStr = '';


            self.type(index, bPart, mPart, aPart);

            function splitSentence(prev, current) {
                if (!prev) {
                    return { bPart: '', mPart: current, aPart: '' };
                }
                if (prev == current) {
                    console.error('two sentence is the same');
                    return { bPart: current, mPart: '', aPart: '' };
                }
                var index = self.getLastSameCharIndex();
                var bPart = prev.slice(0, index);
                var aPart = prev.slice(index, prev.length);
                var inverseIndex = current.lastIndexOf(aPart);
                var mPart = current.slice(index, inverseIndex);

                return { bPart: bPart, mPart: mPart, aPart: aPart };
            }
        }
    }, {
        key: 'deleteTyping',
        value: function deleteTyping() {
            var self = this,
                index = 0,
                currContent = this.currSentence(),
                chars = currContent.slice(self.getLastSameCharIndex()),
                curStr = currContent.slice(0, self.getLastSameCharIndex());

            self.type(index, curStr, chars, '');
        }
    }, {
        key: 'type',
        value: function type(index, bPart, mPart, aPart) {
            var self = this;
            if (index > mPart.length) {
                this.currentCentenceIndex += 1;
                this.walk();
                return;
            }
            this.el.innerHTML = this.moveCursor(bPart, mPart.substring(0, index++), aPart);
            setTimeout(function () {
                self.type(index, bPart, mPart, aPart);
            }, this.opt.charTime);
        }
    }, {
        key: 'moveCursor',
        value: function moveCursor(bPart, curStr, aPart) {
            this.currentCursorPosition = bPart.length + curStr.length;
            return bPart + curStr + '<i class="yatype__cursor">|</i>' + aPart;
        }
    }]);

    return YaType;
}();

;
module.exports = YaType;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
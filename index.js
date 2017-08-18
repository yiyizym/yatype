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
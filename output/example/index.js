'use strict';

var YaType = require('../index.js');

var option = {
    strings: [{ content: '这是一款定投工具' }, { content: '这是一款 ETF 基金定投工具' }, { content: '这是一款不太专业的 ETF 基金定投工具' }],
    effect: 'deleteBack' //moveBack|deleteBack|jumpBack
};

new YaType('#element', option);
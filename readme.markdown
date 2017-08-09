# 模拟打字效果

## 用法
``` javascript
const YaType = require('yatype.js');

let options = [
    {str: '这是一款定投工具'},
    {str: '这是一款 ETF 基金定投工具', effects: [{type: 'insert'}]},
    {str: '这是一款不太专业的 ETF 基金定投工具', effects: [{type: 'insert'}]}
];

new YaType('#element', options);
```
## 对应 DEMO
[]()
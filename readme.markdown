# 模拟打字效果

## 用法
``` javascript
const YaType = require('yatype');

let option = {
    strings: [
        {content: '这是一款定投工具'},
        {content: '这是一款 ETF 基金定投工具'},
        {content: '这是一款不太专业的 ETF 基金定投工具'}
    ],
    effect: 'moveBack' //moveBack|deleteBack|jumpBack
}

new YaType('#element', option);
```
## build
```javascript
//在终端运行：
npm install && npm run build
```
## 运行 example
```javascript
//在终端运行：
npm install && npm run start
//然后打开浏览器访问： localhost:3000/output/example
```

## licence
MIT
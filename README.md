
英语不好的我，看英文视频常有生词，这时候我需要暂停去查词典。
这个插件可以在暂停youtube时，自动翻译当前字幕，节省了我大量的时间，希望也能帮到你。


### 开发记录
- 以下语句可以允许content script注入js，但会导致事件触发两次，故暂时不用
```
"web_accessible_resources": ["youtube.js"]
```
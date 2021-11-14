# `MAC`打包排除`.DS_store`和`__MACOSX`，防止windows运行插件报错
在需要打包的文件夹内运行
```
zip -r youtube-translator.zip . -x ".*" -x "*Zone.Identifier" -x "__MACOSX" -x "*.git*"
```

# Youtube暂停与快进事件
```flow
pause=>operation: 暂停
pauseEvent=>inputoutput: pause事件

pause->pauseEvent
```
```flow
fastforward=>operation: 鼠标点进度条快进
pauseEvent=>inputoutput: pause事件
playEvent=>inputoutput: play事件

fastforward->pauseEvent->playEvent
```

# 增加字幕流程
```flow
pauseEvent=>inputoutput: 暂停事件
stillHaveLinesToTranslate=>condition: 还有某行字幕未翻译
addTranslationWrapperToScreen=>operation: 增加字幕容器到页面
callGoogleTraslationApi=>operation: 调用谷歌翻译API
addTranslationLineToWrapper=>operation: 将一行翻译加入字幕容器
playEvent=>inputoutput: 播放事件
removeTranslationWrapperFromScreen=>end: 移除字幕容器

pauseEvent->addTranslationWrapperToScreen->callGoogleTraslationApi->addTranslationLineToWrapper->stillHaveLinesToTranslate
stillHaveLinesToTranslate(no,bottom)->playEvent->removeTranslationWrapperFromScreen
stillHaveLinesToTranslate(yes)->callGoogleTraslationApi
```
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
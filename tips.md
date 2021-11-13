# `MAC`打包排除`.DS_store`和`__MACOSX`，防止windows运行插件报错
在需要打包的文件夹内运行
```
zip -r youtube-translator.zip . -x ".*" -x "*Zone.Identifier" -x "__MACOSX" -x "*.git*"
```

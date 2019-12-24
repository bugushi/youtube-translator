var googleTranslateAPI = 'https://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=en&tl=zh_cn&q=';

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == "fetchTranslation") {
        var url = googleTranslateAPI + encodeURIComponent(request.text);
        fetch(url)
            .then(response => response.json())
            .then(translation => sendResponse(translation));
        return true;
      }
    });
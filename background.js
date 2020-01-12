var googleTranslateAPI = 'https://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=en&tl=zh_cn&q=';
var youtubePattern = /^https?:\/\/www\.youtube\.com\/.*/;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.contentScriptQuery == "fetchTranslation_guyu") {
            var url = googleTranslateAPI + encodeURIComponent(request.text);
            fetch(url)
                .then(response => response.json())
                .then(translation => sendResponse(translation));
            return true;
        }
    }
);

// To handle youtube video page
chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    if (details.frameId === 0 && youtubePattern.test(details.url)) {
        chrome.tabs.sendMessage(details.tabId, { method: "historyStateUpdated_guyu" }, function (response) {
            console.log("history state updated! tab.url: ", details.url);
        });
    }
});

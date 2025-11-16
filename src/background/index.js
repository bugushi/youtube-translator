const TRANSLATE_ENDPOINT = 'https://translate.google.com/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_cn&q=';
const YOUTUBE_WATCH_PATTERN = /^https?:\/\/www\.youtube\.com\/watch.*/;
const YOUTUBE_HOME_PATTERN = /^https?:\/\/www\.youtube\.com\/?/;

function init() {
    registerTranslationHandler();
    registerNavigationHandler();
}

function registerTranslationHandler() {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
        if (request.contentScriptQuery !== 'fetchTranslation_guyu') {
            return false;
        }

        const url = TRANSLATE_ENDPOINT + encodeURIComponent(request.text || '');
        fetch(url)
            .then(response => response.json())
            .then(translation => sendResponse(translation))
            .catch(error => {
                console.error('Translation request failed', error);
                sendResponse({ sentences: [{ trans: '' }], error: true });
            });

        return true;
    });
}

function registerNavigationHandler() {
    chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
        if (details.frameId !== 0) {
            return;
        }

        if (YOUTUBE_WATCH_PATTERN.test(details.url)) {
            chrome.tabs.sendMessage(details.tabId, { method: 'historyStateUpdated_guyu' }, () => {
                console.log('history state updated! tab.url: ', details.url);
            });
            return;
        }

        if (YOUTUBE_HOME_PATTERN.test(details.url)) {
            chrome.tabs.sendMessage(details.tabId, { method: 'backToYoutubeHomepage_guyu' }, () => {
                console.log('back to youtube homepage');
            });
        }
    });
}

init();

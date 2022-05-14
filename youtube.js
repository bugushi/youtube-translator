// fast forward will trigger pause an play in sequence. only exact pause action can leed to translation
// timer is the setTimeout id of pause event listener
var timer = null;
var videoElement = document.querySelector('video');

videoElement && videoElement.addEventListener('pause', pauseEvent);
videoElement && videoElement.addEventListener('play', playEvent);

// update video element
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == "historyStateUpdated_guyu") {
        videoElement = document.querySelector('video');
        videoElement && videoElement.addEventListener('pause', pauseEvent);
        videoElement && videoElement.addEventListener('play', playEvent);
        sendResponse(null);
    }
});

function pauseEvent() {
    // fast forward will trigger pause an play in sequence. only exact pause action can leed to translation
    timer = setTimeout(translate, 50);
}

function playEvent() {
    clearTimeout(timer);
    // remove the previous translation wrapper
    let previousTranslationWrapper = document.querySelector('.guyu-translation-wrapper')
    previousTranslationWrapper && previousTranslationWrapper.remove();
}

function translate() {
    let translationWrapper = document.createElement('div');
    translationWrapper.classList.add('guyu-translation-wrapper');

    let playerContainer = document.querySelector('#ytd-player');
    playerContainer && playerContainer.appendChild(translationWrapper);

    let captionTexts = getCaptionLines();
    Array.prototype.forEach.call(captionTexts, (text, index) => {
        chrome.runtime.sendMessage(
            { contentScriptQuery: "fetchTranslation_guyu", text, index },
            translation => {
                let translationText = translation.sentences[0].trans;
                addTranslationToScreen(translationText, index);
            });
    })
}

function getCaptionLines() {
    let captionLines = document.querySelectorAll('.ytp-caption-segment');
    let captionTexts = [...captionLines].map(line => {
        return line.innerText;
    })
    return captionTexts;
}

function addTranslationToScreen(translation, index) {
    let translationWrapper = document.querySelector('.guyu-translation-wrapper');
    let captionFontSize = document.querySelector(".ytp-caption-segment").style.fontSize;

    let translationLine = document.createElement('div');
    translationLine.classList.add('guyu-translation-line');
    translationLine.style.fontSize = parseFloat(captionFontSize) * 0.9 + 'px';
    translationLine.innerText = translation;

    // if the second translation line response later, then insert after the first translation line
    let exsitedTranslationLine = document.querySelector('.guyu-translation-line');
    if (exsitedTranslationLine && index == 1) {
        translationWrapper.append(translationLine);
        return;
    }

    translationWrapper?.prepend(translationLine);
}
var isTranslating = false;
// fast forward will trigger pause an play in sequence. only exact pause action can leed to translation
var isFastForwad = false; 
var timestamp = 0;

const videoElement = document.querySelector('video');
videoElement && videoElement.addEventListener('pause', () => {
    // prevent pause event from being fired twice
    if (isTranslating) { return; }
    isTranslating = true;

    // fast forward will trigger pause an play in sequence. only exact pause action can leed to translation
    isFastForwad = false;
    timestamp=new Date().getTime()
    waitForTerminateInPeriod(translate, 50);

    // prevent pause event from being fired twice
    setTimeout(() => {
        isTranslating = false;
    }, 100);
});

videoElement && videoElement.addEventListener('play', () => {
    let now = new Date().getTime()
    if(now - timestamp < 20) {
        isFastForwad = true;
    }

    // remove the previous translation wrapper
    let previousTranslationWrapper = document.querySelector('.guyu-translation-wrapper')
    previousTranslationWrapper && previousTranslationWrapper.remove();
});

function translate() {
    let translationWrapper = document.createElement('div');
    translationWrapper.classList.add('guyu-translation-wrapper');
    
    let playerContainer = document.querySelector('#player-container');
    playerContainer && playerContainer.appendChild(translationWrapper);

    let captionTexts = getCaptionLines();
    Array.prototype.forEach.call(captionTexts, (text, index) => {
        chrome.runtime.sendMessage(
            { contentScriptQuery: "fetchTranslation", text, index },
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

    translationWrapper.prepend(translationLine);
}

// action will be excute if no TERMINATE signal has been received in PERIOD of time
function waitForTerminateInPeriod(action, period) {
    setTimeout(() => {
        if(!isFastForwad) {
            action();
        }
    }, period);
}
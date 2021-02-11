(function () {
    let isAdvActive = false;

    // max show 6 times and 50% chance to show
    let adShowTimes = localStorage.getItem('adShowTimes');
    if (adShowTimes) {
        if (Number(adShowTimes) < 9 && Math.random() < 0.75) {
            showAd(() => {
                localStorage.setItem('adShowTimes', String(Number(adShowTimes) + 1));
            });
        }
    } else {
        localStorage.setItem('adShowTimes', '0');
    }

    // correct ad when back to homepage
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.method == "backToYoutubeHomepage_guyu") {
            if(isAdvActive) {
                let counter = 0;
                let timer = setInterval(() => {
                    let imgEl = document.querySelector('ytd-display-ad-renderer #media #img');
                    if(imgEl && imgEl.src && imgEl.src != chrome.runtime.getURL('images/front-end-adv.png')) {
                        clearInterval(timer);
                        showAd();
                        return;
                    }

                    if(counter > 10) {
                        clearInterval(timer)
                        return;
                    }
                    counter++;
                }, 500);
            }
            sendResponse(null);
        }
    });

    function showAd(fn) {
        let container = 'ytd-display-ad-renderer';
        let imgSelector = 'ytd-display-ad-renderer #media #img';
        let overylayButtonSelector = 'ytd-display-ad-renderer #media-hover-overlay #button';
        let titleSelector = 'ytd-display-ad-renderer #title-text';
        let descSelector = 'ytd-display-ad-renderer #body-text';
        let advertiserSelector = 'ytd-display-ad-renderer #secondary-text';

        let containerEl = document.querySelector(container);
        let imgEl = document.querySelector(imgSelector);
        let overlayEl = document.querySelector(overylayButtonSelector);
        let titleEl = document.querySelector(titleSelector);
        let descEl = document.querySelector(descSelector);
        let advertiserEl = document.querySelector(advertiserSelector);

        if (containerEl && imgEl && overlayEl && titleEl && descEl && advertiserEl) {
            isAdvActive = true;

            // add listener
            containerEl.removeEventListener('click', jumpToBilibili);
            containerEl.addEventListener('click', jumpToBilibili, true);

            imgEl.src = chrome.runtime.getURL('images/front-end-adv.png');
            overlayEl.innerText = '立即查看';
            titleEl.innerText = '前端基础16课——从入门到放弃';
            titleEl.title = '前端基础16课——从入门到放弃';
            descEl.innerText = '从 TodoList 例子入手，抓大放小，串起前端三件套 HTML + CSS + JS 的基础部分知识';
            descEl.title = '从 TodoList 例子入手，抓大放小，串起前端三件套 HTML + CSS + JS 的基础部分知识';
            advertiserEl.innerText = '前端基础课';
            advertiserEl.title = '前端基础课';

            fn && fn();
        }
    }

    function jumpToBilibili(event) {
        window.open('https://www.bilibili.com/video/BV1wt4y1z7yD', '_blank');
        event.stopPropagation();
    }
})();
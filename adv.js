(function () {
    // max show 6 times and 50% chance to show
    let adShowTimes = localStorage.getItem('adShowTimes');
    if(adShowTimes) {
        if(Number(adShowTimes) < 9 && Math.random() < 0.75) {
            showAd();
            localStorage.setItem('adShowTimes', String(Number(adShowTimes) + 1));
        }
    } else {
        localStorage.setItem('adShowTimes', '0');
    }

    function showAd() {
        let container = 'ytd-display-ad-renderer';
        let imgSelector = 'ytd-display-ad-renderer #media #img';
        let overylayButtonSelector = 'ytd-display-ad-renderer #media-hover-overlay #button';
        let titleSelector = 'ytd-display-ad-renderer #title-text';
        let descSelector = 'ytd-display-ad-renderer #body-text';
        let advertiserSelector = 'ytd-display-ad-renderer #secondary-text';

        // add listener
        document.querySelector(container).addEventListener('click', (event) => {
            window.open('https://www.bilibili.com/video/BV1wt4y1z7yD', '_blank');
            event.stopPropagation();
        }, true);

        document.querySelector(imgSelector).src = chrome.runtime.getURL('images/front-end-adv.png');
        document.querySelector(overylayButtonSelector).innerText = '立即查看';
        document.querySelector(titleSelector).innerText = '前端基础16课——从入门到放弃';
        document.querySelector(titleSelector).title = '前端基础16课——从入门到放弃';
        document.querySelector(descSelector).innerText = '从 TodoList 例子入手，抓大放小，串起前端三件套 HTML + CSS + JS 的基础部分知识';
        document.querySelector(descSelector).title = '从 TodoList 例子入手，抓大放小，串起前端三件套 HTML + CSS + JS 的基础部分知识';
        document.querySelector(advertiserSelector).innerText = '前端基础课';
        document.querySelector(advertiserSelector).title = '前端基础课';
    }
})();
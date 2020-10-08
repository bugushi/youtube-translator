// switch属性
let options = {
    size: 'small',
    onText: 'ON',
    offText: 'OFF',
    showText: true,
    checked: true,
    onChange: (isChecked) => {
        chrome.storage.sync.set({ 'isSkipAd': isChecked }, () => {
            console.log('storage isSkipAd is set to ', isChecked);
        })
    }
}


chrome.storage.sync.get(['isSkipAd'], function (result) {
    console.log('result.isSkipAd=', result.isSkipAd);
    var el = document.querySelector('.checkbox-switch');

    if (typeof result.isSkipAd == 'undefined') {
        chrome.storage.set({ 'isSkipAd': true }, () => {
            options.checked = true;
            let mySwitch = new Switch(el, options);
        })
    } else {
        options.checked = result.isSkipAd;
        let mySwitch = new Switch(el, options);
    }
});
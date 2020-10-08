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
    console.log('result.isSkipAd', result.isSkipAd);
    if (typeof result.isSkipAd !== 'undefined') {
        options.checked = result.isSkipAd;

        chrome.storage.sync.set({ 'isSkipAd': true })
    }
    
    console.log('storage result is ' + JSON.stringify(result));
    var el = document.querySelector('.checkbox-switch');
    var mySwitch = new Switch(el, options);
});
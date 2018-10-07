// autoloading tab set
chrome.storage.local.clear();

// chrome.windows.getCurrent(function (win) {
// 	Sets.autoLoad(win.id);
// });

var listener = function (win) {
    console.log('Listener activated');
    chrome.windows.getAll(null, function (wins) {
        if (wins.length < 2 && win.type === 'normal') {
            Sets.autoLoad(win.id);
        }
    });
}

// will this always fire at start
chrome.windows.onCreated.removeListener(listener);
chrome.windows.onCreated.addListener(listener);

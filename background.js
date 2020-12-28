// autoloading tab set
browser.storage.local.clear();

// browser.windows.getCurrent(function (win) {
// 	Sets.autoLoad(win.id);
// });

var listener = function (win) {
    console.log('Listener activated');
    browser.windows.getAll(null, function (wins) {
        if (wins.length < 2 && win.type === 'normal') {
            Sets.autoLoad(win.id);
        }
    });
}

// will this always fire at start
browser.windows.onCreated.removeListener(listener);
browser.windows.onCreated.addListener(listener);

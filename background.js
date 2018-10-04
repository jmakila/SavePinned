// autoloading tab set
chrome.storage.local.clear();

chrome.windows.getCurrent(function (win) {
	Sets.autoLoad(win.id);
});

chrome.windows.onCreated.removeListener(listener);
chrome.windows.onCreated.addListener(listener);

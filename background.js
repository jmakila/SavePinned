// autoloading tab set
chrome.storage.local.clear();

chrome.windows.getCurrent(function (win) {
	// TODO why does this amount to "winid" in the Storage Area ???
	alert(win.id);
	Sets.autoLoad(win.id);
});
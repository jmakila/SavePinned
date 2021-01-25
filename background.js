// autoloading tab set
browser.storage.local.clear();

browser.runtime.onStartup.addListener(function () {
    browser.windows.getCurrent().then(function (win) {
        Sets.autoLoad(win.id);
    });
});
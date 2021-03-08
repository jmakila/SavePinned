// autoloading tab set
browser.storage.local.clear();

let autoloadedOnInitialWindow = false;

var listener = function (win) {
  console.log("listener called");
  autoloadedOnInitialWindow = true;

  browser.windows.getAll(null).then(function (wins) {
    console.log("all windows", wins);
    if (wins.length < 2 && win.type === "normal") {
      Sets.autoLoad(win.id);
    }
  });
};

if (!browser.windows.onCreated.hasListener(listener)) {
  console.log("browser does not have listener, adding now");
  browser.windows.onCreated.addListener(listener);
}

// Firefox workaround:
//  browser.windows.onCreated fires before the extension is loaded in Firefox
//  so we run autoload manually, only if it has not been run before
if (!autoloadedOnInitialWindow) {
  console.log("never autoloaded on initial window");
  browser.windows.getCurrent().then(function (win) {
    console.log("win is ", win);
    listener(win);
  });
}

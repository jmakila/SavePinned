var Sets = (function () {

    var windowId = null;
    browser.windows.getCurrent().then(function (win) {
        windowId = win.id;
    });

    var set_active = function (id, winid) {
        browser.storage.local.get(['activeTabs']).then(function(result) {
            var atabs = result.activeTabs || {};
            atabs[winid] = id;
            browser.storage.local.set({'activeTabs': atabs}).then(function() {
                console.log('Active tabset for window '+winid+' is set to '+id);
                window.location.href = "popup.html";
            });
        });
    }

    return {
        save: function (name, autoload) {
            var urilist = [];
        	browser.tabs.query({
        		pinned: true,
        		currentWindow: true
        	}).then(function (tabs) {
        		for (var i = 0; i < tabs.length; i++) {
        			urilist[i] = tabs[i].url;
        		}
        		if (urilist.length > 0) {
        			var saveObj = {};
        			var uid = window.btoa(name);
        			saveObj[uid] = {
        				set_name: name,
        				autoload: autoload || 0,
        				tabs: urilist
        			};
        			browser.storage.sync.set(saveObj).then(function () {
        				set_active(uid, windowId);
        			});
        		} else {
        			console.log('No pinned tabs found!');
        		}
        	});
        },
        load: function (id, winid) {
            browser.storage.sync.get(id).then(function (set) {
        		var tabs = set[id].tabs;
        		browser.tabs.query({
        			pinned: true,
                    windowId: winid
        		}).then(function (cutabs) {
                    var list = [];

        			for (ind of cutabs) {
        				list.push(ind.id);
        			}

                    browser.tabs.remove(list);

                    for (inx of tabs) {
                        browser.tabs.create({
                            windowId: winid,
                            url: inx,
                            active: false,
                            pinned: true
                        });
                    }

                    console.log('Loaded tabs');
                    set_active(id, winid);
        		});
        	});
        },
        delete: function (id) {
			swal({
				buttons: ['Cancel', 'Delete'],
				className: 'confirm-delete-dialog',
				text: "Do you really want to delete this tab set?",
			}).then(function (conf) {
				if (conf) browser.storage.sync.remove(id).then(function () {
					window.location.href = "popup.html";
				});
			});
        },
        get: function () {
            browser.storage.sync.get(null).then(function (sets) {
                var winid = windowId;
                browser.storage.local.get('activeTabs').then(function (result) {
                  var active = result.activeTabs ? result.activeTabs[winid] : null;
              		for (var property in sets) {
              			if (sets.hasOwnProperty(property)) {
              				var row = sets[property];
              				var template = '\
              				<div class="load-row '+(active === property ? 'active' : '')+'" data-id="'+property+'" data-name="'+row.set_name+'" data-autoload="'+row.autoload+'">\
              					<span>'+row.set_name+'</span>\
              					<label><input type="checkbox" name="autoload" class="autoload-radio" value="'+property+'" '+(row.autoload ? 'checked' : '')+'> Autoload</label>\
                                  '+(active === property ? '<button class="set-save">Save</button>' : '')+'\
              					<button class="set-load">Load</button>\
              					<button class="set-delete">Del</button>\
              				</div>';
              				var area = document.getElementById('load-area');
              				area.insertAdjacentHTML('beforeend', template);
              				var plcelement = document.getElementById('placeholder')
              				if (plcelement) plcelement.remove();
              			}
              		}

            		// load buttons
            		var loadbtns = document.getElementsByClassName('set-load');
            		for (var i=0; i < loadbtns.length; i++) {
            			loadbtns[i].addEventListener('click', function () {
            				var id = this.parentNode.dataset.id;
            				Sets.load(id, winid);
            			});
            		}

                    // save buttons
            		var loadbtns = document.getElementsByClassName('set-save');
            		for (var i=0; i < loadbtns.length; i++) {
            			loadbtns[i].addEventListener('click', function () {
            				var name = this.parentNode.dataset.name;
            				var auto = this.parentNode.dataset.autoload == 1 ? 1 : 0;
            				Sets.save(name, auto);
            			});
            		}

            		// delete buttons
            		var deletebtns = document.getElementsByClassName('set-delete');
            		for (var j=0; j < deletebtns.length; j++) {
            			deletebtns[j].addEventListener('click', function () {
            				var id = this.parentNode.dataset.id;
            				Sets.delete(id);
            			});
            		}

            		// autoload radios
            		var radioElements = document.getElementsByClassName('autoload-radio');
            		for (var i=0; i < radioElements.length; i++) {
            			radioElements[i].addEventListener('click', function () {
            				if (this.checked) Sets.setAutoload(this.value);
            				else Sets.setAutoload(false);
            			});
            		}

                });
        	});
        },
        setAutoload: function (id) {
            browser.storage.sync.get(null).then(function (sets) {
        		for (var property in sets) {
        			if (sets.hasOwnProperty(property)) {
        				if (id && property == id) sets[property].autoload = 1;
        				else sets[property].autoload = 0;
        			}
        		}
        		browser.storage.sync.set(sets).then(function () {
        			window.location.href = "popup.html";
        		});
        	});
        },
        clearActive: function (winid) {
            set_active(null, winid);
        },
        autoLoad: function (winid) {
            browser.tabs.query({
                pinned: true,
                windowId: winid
            }).then(function (cutabs) {
                browser.storage.sync.get(null).then(function (sets) {
            		var autoloaded = false;
            		for (var property in sets) {
            			if (sets.hasOwnProperty(property)) {
            				var set = sets[property];
            				if (set.autoload == 1) { // there is a tab set to be autoloaded
                                console.log('Autoloading tabs');
            					autoloaded = true;
            					Sets.load(property, winid);
                                break;
            				}
            			}
            		}
            		if (!autoloaded) Sets.clearActive(winid);
            	});
            });
		},
		export: function () {
			var fileName = "SavePinnedTabs_export_" + new Date().toISOString().replaceAll(/[.:]/g, "-") + '.json';
			
			return browser.storage.sync.get(null).then(function (sets) {
				var fileText = JSON.stringify(sets);
				var fileBlob = new Blob([fileText], { type: "application/json;charset=utf-8" });
				saveAs(fileBlob, fileName);
			});
		},
		import: function (sets) {
			if (!validate20(sets)) {
				return Promise.reject();
			}

			return browser.storage.sync.set(sets);
		},
    }
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var Autoload = (function () {
  let ranOnce = false;

  return {
    windowCreated: function (window) {
      console.log("windowCreated");
      ranOnce = true;

      browser.windows.getAll(null).then(function (windows) {
        if (windows.length < 2 && window.type === "normal") {
          Sets.autoLoad(window.id);
        }
      });
    },

    manual: async function () {
      // Brave workaround:
      //  wait a few milliseconds for browser.windows.onCreated to fire
      //  before checking if we need to manually run windowCreated
      //  to ensure brave does not load tab set twice
      await sleep(50);

      // Firefox workaround:
      //  browser.windows.onCreated does not fire reliably in Firefox
      //  so we run autoload manually, only if it has not been run before
      if (!ranOnce) {
        browser.windows.getCurrent().then(function (window) {
          Autoload.windowCreated(window);
        });
      }
    },
  };
})();

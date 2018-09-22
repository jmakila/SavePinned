var Sets = (function () {

    var windowId = null;
    chrome.windows.getCurrent(function (win) {
        windowId = win.id;
    });

    var set_active = function (id, winid) {
        chrome.storage.local.get(['activeTabs'], function(result) {
            var atabs = result.activeTabs;
            if (atabs) atabs[winid] = id;
            else atabs = {winid: id};
            chrome.storage.local.set({'activeTabs': atabs}, function() {
                console.log('Active tabset for window '+winid+' is set to '+id);
                window.location.href = "popup.html";
            });
        });
    }

    return {
        save: function (name, autoload) {
            var urilist = [];
        	chrome.tabs.query({
        		pinned: true,
        		currentWindow: true
        	}, function (tabs) {
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
        			chrome.storage.sync.set(saveObj, function () {
        				set_active(uid, windowId);
        			});
        		} else {
        			console.log('No pinned tabs found!');
        		}
        	});
        },
        load: function (id, winid) {
            chrome.storage.sync.get(id, function (set) {
        		var tabs = set[id].tabs;
        		chrome.tabs.query({
        			pinned: true,
                    windowId: winid
        		}, function (cutabs) {
        			for (ind in cutabs) {
        				chrome.tabs.remove(cutabs[ind].id);
        			}
        			for (inx in tabs) {
        				chrome.tabs.create({
                            windowId: winid,
        					url: tabs[inx],
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
          var conf = confirm("Do you really want to delete this tab set?");
        	if (conf) chrome.storage.sync.remove(id, function () {
        		window.location.href = "popup.html";
        	});
        },
        get: function () {
            chrome.storage.sync.get(null, function (sets) {
                var winid = windowId;
                chrome.storage.local.get('activeTabs', function (result) {
                  var active = result.activeTabs[winid];
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
            chrome.storage.sync.get(null, function (sets) {
        		for (var property in sets) {
        			if (sets.hasOwnProperty(property)) {
        				if (id && property == id) sets[property].autoload = 1;
        				else sets[property].autoload = 0;
        			}
        		}
        		chrome.storage.sync.set(sets, function () {
        			window.location.href = "popup.html";
        		});
        	});
        },
        clearActive: function (winid) {
            set_active(null, winid);
        },
        autoLoad: function (winid) {
            chrome.tabs.query({
                pinned: true,
                windowId: winid
            }, function (cutabs) {
                chrome.storage.sync.get(null, function (sets) {
            		var autoloaded = false;
            		for (var property in sets) {
            			if (sets.hasOwnProperty(property)) {
            				var set = sets[property];
            				if (set.autoload == 1) { // there is a tab set to be autoloaded

                                // remove current tabs
                                if (cutabs.length) {
                                    for (ind in cutabs) {
                        				chrome.tabs.remove(cutabs[ind].id);
                        			}
                                }

                                console.log('Autoloading tabs');
            					autoloaded = true;
            					Sets.load(property, winid);
                                set_active(property, winid);
                                break;
            				}
            			}
            		}
            		if (!autoloaded) Sets.clearActive(winid);
            	});
            });
        }
    }
})();

var listener = function (win) {
    console.log('Listener activated');
	Sets.autoLoad(win.id);
}

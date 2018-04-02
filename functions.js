var Sets = (function () {
  return {
    save: function (name) {
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
    				autoload: false,
    				tabs: urilist
    			};
    			chrome.storage.sync.set(saveObj, function () {
    				window.location.href = "popup.html";
    			});
    		} else {
    			console.log('No pinned tabs found!');
    		}
    	});
    },
    load: function (id) {
        chrome.storage.sync.get(id, function (set) {
    		var tabs = set[id].tabs;
    		chrome.tabs.query({
    			pinned: true,
    			currentWindow: true
    		}, function (cutabs) {
    			for (ind in cutabs) {
    				chrome.tabs.remove(cutabs[ind].id);
    			}
    			for (inx in tabs) {
    				chrome.tabs.create({
    					url: tabs[inx],
    					active: false,
    					pinned: true
    				});
    			}
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
    		for (var property in sets) {
    			if (sets.hasOwnProperty(property)) {
    				var row = sets[property];
    				var template = '\
    				<div class="load-row" data-id="'+property+'">\
    					<span>'+row.set_name+'</span>\
    					<label><input type="checkbox" name="autoload" class="autoload-radio" value="'+property+'" '+(row.autoload ? 'checked' : '')+'> Autoload</label>\
    					<button class="set-load">Load</button>\
    					<img class="set-delete" src="images/delete_16.png">\
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
    				Sets.load(id);
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
    				if (this.checked) Autoload.set(this.value);
    				else Autoload.set(false);
    			});
    		}

    	});
    }
  }
})();

var Autoload = (function () {
    return {
        set: function (id) {
            chrome.storage.sync.get(null, function (sets) {
        		for (var property in sets) {
        			if (sets.hasOwnProperty(property)) {
        				if (id && property == id) sets[property].autoload = true;
        				else sets[property].autoload = false;
        			}
        		}
        		chrome.storage.sync.set(sets, function () {
        			window.location.href = "popup.html";
        		});
        	});
        }
    }
})();

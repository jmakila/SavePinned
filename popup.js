
function save_set(name) {
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
				tabs: urilist
			};
			chrome.storage.sync.set(saveObj, function () {
				window.location.href = "popup.html";
			});
		} else {
			console.log('No pinned tabs found!');
		}
	});
}

function load_set(id) {
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
}

function delete_set(id) {
	chrome.storage.sync.remove(id, function () {
		window.location.href = "popup.html";
	});
}

function get_sets() {
	chrome.storage.sync.get(null, function (sets) {
		for (var property in sets) {
			if (sets.hasOwnProperty(property)) {
				var row = sets[property];
				var template = '\
				<div class="load-row" data-id="'+property+'">\
					<span>'+row.set_name+'</span><button class="set-load">Load</button><img class="set-delete" src="images/delete_16.png">\
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
				load_set(id);
			});
		}

		// delete buttons
		var deletebtns = document.getElementsByClassName('set-delete');
		for (var j=0; j < deletebtns.length; j++) {
			deletebtns[j].addEventListener('click', function () {
				var id = this.parentNode.dataset.id;
				delete_set(id);
			});
		}

	});
}


document.getElementById('save-button').addEventListener('click', function () {
	var name = document.getElementById('save-name').value;
	if (name) save_set(name);
});
document.getElementById('save-name').addEventListener('keydown', function (event) {
	if (event.keyCode == 13) {
		var name = document.getElementById('save-name').value;
		if (name) save_set(name);
	}
});
document.getElementById('save-name').focus();
document.addEventListener('DOMContentLoaded', get_sets);
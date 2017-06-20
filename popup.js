

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4();
}

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
			var uid = guid();
			saveObj[uid] = {
				set_name: name,
				tabs: urilist
			};
			chrome.storage.sync.set(saveObj, function () {

				// reload page
				window.location.href = "popup.html";

			});
		} else {
			console.log('No pinned tabs found!');
		}
	});
}

function get_sets() {
	chrome.storage.sync.get(null, function (sets) {

		for (var property in sets) {
			if (sets.hasOwnProperty(property)) {


				console.log(property);
				console.log(sets[property]);
				var row = sets[property];

				var template = '\
				<div class="load-row" data-id="'+property+'">\
					<span>'+row.set_name+'</span><button class="set-load">Load</button><img class="set-delete" src="images/delete_16.png">\
				</div>';

				var area = document.getElementById('load-area');
				area.insertAdjacentHTML('beforeend', template);

			}
		}
	});
}


document.getElementById('save-button').addEventListener('click', function () {

	var name = document.getElementById('save-name').value;
	if (name) save_set(name);

});
document.addEventListener('DOMContentLoaded', get_sets);
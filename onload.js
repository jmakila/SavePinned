
// autoloading tab set
chrome.storage.sync.get(null, function (sets) {
	for (var property in sets) {
		if (sets.hasOwnProperty(property)) {
			var set = sets[property];
			if (set.autoload === true) {
				var tabs = set.tabs;
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
			}
		}
	}
});
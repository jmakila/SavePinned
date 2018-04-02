// autoloading tab set
chrome.storage.sync.get(null, function (sets) {
	for (var property in sets) {
		if (sets.hasOwnProperty(property)) {
			var set = sets[property];
			if (set.autoload === true) {
				Sets.load(property);
			}
		}
	}
});

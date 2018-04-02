// autoloading tab set
chrome.storage.sync.get(null, function (sets) {
	var autoloaded = false;
	for (var property in sets) {
		if (sets.hasOwnProperty(property)) {
			var set = sets[property];
			if (set.autoload == 1) {
				autoloaded = true;
				Sets.load(property);
			}
		}
	}
	if (!autoloaded) Sets.clearActive();
});

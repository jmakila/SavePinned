import { Sets } from "./functions.js";

document.getElementById('save-button').addEventListener('click', function () {
	var name = document.getElementById('save-name').value;
	if (name) Sets.save(name);
});
document.getElementById('save-name').addEventListener('keydown', function (event) {
	if (event.keyCode == 13) {
		var name = document.getElementById('save-name').value;
		if (name) Sets.save(name);
	}
});
document.getElementById('save-name').focus();
document.addEventListener('DOMContentLoaded', Sets.get);

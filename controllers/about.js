'use strict';

function about() {
	const cmd = {
		title: {title: 'about this'},
	};
	return new Promise(function(resolve, reject) {
		resolve(cmd);
	});
};
module.exports = about

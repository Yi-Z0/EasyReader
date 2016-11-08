'use strict';
const stripAnsi = require('strip-ansi');
const isFullwidthCodePoint = require('is-fullwidth-code-point');

module.exports = str => {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	let width = 0;

	str = stripAnsi(str);

	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);

		if (stringWidthMap[code]) {
			return stringWidthMap[code];
		}
		// ignore control characters
		if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) {
			continue;
		}

		// surrogates
		if (code >= 0x10000) {
			i++;
		}

		if (isFullwidthCodePoint(code)) {
			width += 2;
		} else {
			width++;
		}
	}

	return width;
};


let stringWidthMap = {
	32:0.5,
	8212:2,
	8230:2,
}

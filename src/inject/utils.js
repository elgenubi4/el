///
/// WARNING:
///
///    DON'T call other functions in each functions in this file,
///    because each functions in this file may be converted to string for inject to page.
///

const utilsFunctions = {
	getInjectUtilsScript,
	el,
	$,
	$$,
	escapeHTML,
	parseCarNumber,
};
export default utilsFunctions;

/**
 * This function return a JavaScript codes for register all functions in a global vairbale
 * @param {string} globalVariableName
 * @returns {string}
 */
function getInjectUtilsScript(globalVariableName) {
	let result = `window.${globalVariableName} = {};`;
	result += Object.keys(utilsFunctions)
		.filter(funcName => funcName !== 'getInjectUtilsScript')
		.map(funcName => {
			const funcBody = utilsFunctions[funcName].toString();
			return `${globalVariableName}.${funcName} = (${funcBody});`
		}).join('');
	return result;
}

/**
 * Create a HTML element
 * @param {string} tageName
 * @param {any} styles
 * @param {any} [attrs]
 * @param {any} [children]
 * @returns {HTMLElement}
 */
function el(tageName, style, attrs, children) {
	const element = document.createElement(tageName);
	if (style)
		Object.keys(style).forEach(key => element.style[key] = style[key]);
	if (attrs)
		Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key]));

	if (children) {
		if (Array.isArray(children))
			children.forEach(child => element.append(child));
		else
			element.append(children);
	}
	return element;
}

/**
 * element.querySelector
 * @param {string} selector
 * @param {HTMLElement|Document} [element]
 * @returns {HTMLElement}
 */
function $(selector, element) {
	return (element || document).querySelector(selector);
}

/**
 * element.querySelectorAll (result be converted to an array)
 * @param {string} selector
 * @param {HTMLElement|Document} [element]
 * @returns {HTMLElement}
 */
function $$(selector, element) {
	return Array.from((element || document).querySelectorAll(selector) || []);
}

/**
 * Escape special characters in text to safe for printing as HTML
 * @param {string} text
 * @returns {string}
 */
function escapeHTML(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Parse a car number from a text
 * @param {string} str
 * @returns {string}
 */
function parseCarNumber(str = '') {
	const matchers = [
		// Tokyo hot
		[/Tokyo[-\s]+Hot[-\s]+(\w{4,6})/i, match => `Tokyo-Hot-${match[1]}`],

		// AXDVD-0000R
		[/AXDVD[-\s+](\d{3,5}\w)/i, match => `AXDVD-${match[1]}`],

		//LOVE series ...
		[/LOVE[-\s](\d{3,4})/i, match => `LOVE-${match[1]}`],

		//10musume 123117_01 ...
		[/10musume[-_\s](\d{6})[-_\s](\d{2})/i, match => `10musume-${match[1]}-${match[2]}`],

		// fc2-ppv-10045 or fc2ppv-10056 ...
		[/fc2[\s\-_]?ppv[\s\-_]?(\d+)/i, match => `FC2-PPV-${match[1]}`],

		// S-Cute Ava #1
		[/S-Cute\s+(\w+)\s+#(\d+)/i, match => `S-Cute-${match[1]}-${match[2]}`],

		//Heydouga
		[/Heydouga[-_\s]?(\d+)[-_\s]?(\d+)/i, match => `Heydouga-${match[1]}-${match[2]}`],

		//heyzo
		[/heyzo[-_\s]?(\d+)/i, match => `heyzo-${match[1]}`],

		//Caribbean
		[/(\d+)[-_\s](\d+)[-_\s]Carib(?:bean(?:com)?)?/i, match => `carib-${match[1]}-${match[2]}`],
		[/Carib(?:bean(?:com)?)?[-_\s]?(\d+)[-_\s]?(\d+)/i, match => `carib-${match[1]}-${match[2]}`],

		//Korean BJ Live Share (KBJ KOREAN BJ2019012311)
		[/(?:kbj|korean).+bj(20\d+)/i, match => `Korean-BJ-${match[1]}`],

		//xxx-010 ...
		/\w+-\d+/i,

		//xxxxx-01223-123
		[/(\w{8,})[-_\s](\d{5,})[-_\s](\d{3,})/, match => `${match[1]}-${match[2]}-${match[3]}`]
	];

	for (let matcher of matchers) {
		// isArray with result convertor
		if (Array.isArray(matcher)) {
			let result = str.match(matcher[0]);
			if (result)
				return matcher[1](result);
		} else {
			let result = str.match(matcher);
			if (result)
				return result[0];
		}
	}

	return null;
}

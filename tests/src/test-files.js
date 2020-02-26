const isIE = false;
window['no-native-shim'] = !isIE;
const files = '<link rel="stylesheet" href="../node_modules/mocha/mocha.css">' +
	'<link rel="stylesheet" href="/dist/form.css" />' +
	'<script src="../node_modules/mocha/mocha.js"></script>' +
    '<script src="../node_modules/chai/chai.js"></script>' +
    '<script src="../node_modules/chai-spies/chai-spies.js"></script>' +
    '<script src="../node_modules/@clubajax/dates/src/dates.js"></script>' +
	(isIE ? '<script src="./src/polyfills.js"></script>' : '') +
	'<script src="../dist/vendor.js"></script>' +
	'<script src="../dist/dev.js"></script>' +
	'<script src="//localhost:35701/livereload.js"></script>';

document.write(files);

document.addEventListener('DOMContentLoaded', function () {
	const isIE = /Trident/.test(navigator.userAgent);
	function CustomError (msg) {
		Error.call(this);
		Error.stackTraceLimit = 10;
		Error.prepareStackTrace = function (err, stack) {
			return stack;
		};
		try {
			Error.captureStackTrace(this, arguments.callee);
		} catch (er) {
			// throw new Error(msg);
		}
		if (/to\sequal/.test(msg)) {
			const parts = msg.replace('expected ', '').split(' to equal ');
			msg = 'actual:\n' + parts[0] + '\nshould be:\n' + parts[1];
		}
		console.log(msg);
		this.message = msg;
		this.name = 'CustomError';
	}

	CustomError.prototype.__proto__ = Error.prototype;

	function getFileName (frame) {
		const filename = frame.getFileName();
		return filename ? filename.split('/')[filename.split('/').length - 1] : '';
    }
    
	chai.Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {

		if (!chai.util.test(this, arguments)) {
			msg = chai.util.getMessage(this, arguments);
			let e;

			e = new CustomError(msg);
			if (e.stack) {
				const stack = [msg];
				for (let i = 0; i < e.stack.length; i++) {
					const frame = e.stack[i];
					// method is usually anonymous in expectations because it is in a ready() function
					const method = frame.getFunctionName() || frame.getMethodName() || 'anonymous';
					const filename = getFileName(frame);
					const line = frame.getLineNumber();
					if (!/test-files|chai/.test(filename)) {
						stack.push('    ' + method + ' ' + filename + ':' + line);
					}
				}
				throw new Error(stack.join('\n'));
			} else {
				if (isIE) {
					console.trace('');
				}
				throw new Error(msg);
			}
		}
	};

});

function checkForUnLoadedNodes(){
	const docNodes = document.querySelectorAll('*');
	for (let i = 0; i < docNodes.length; ++i) {
		const node = docNodes[i];
		if (node.nodeName.indexOf('-') > -1 && !node.DOMSTATE) {
			console.error(node.nodeName.toLowerCase(), 'is not initialized. Did you forget to import it?');
		}
	}
}

setTimeout(checkForUnLoadedNodes, 2000);

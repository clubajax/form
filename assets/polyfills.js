if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		return function from(arrayLike/*, mapFn, thisArg */) {
			var C = this;
			var items = Object(arrayLike);
			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			var len = toLength(items.length);
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);
			var k = 0;
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			A.length = len;
			return A;
		};
	}());
}

if (!Array.prototype.findIndex) {
	Object.defineProperty(Array.prototype, 'findIndex', {
		value: function(predicate) {
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			var o = Object(this);
			var len = o.length >>> 0;
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			var thisArg = arguments[1];
			var k = 0;
			while (k < len) {
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return k;
				}
				k++;
			}
			return -1;
		}
	});
}

if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
		value: function(predicate) {
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}
			var o = Object(this);
			var len = o.length >>> 0;
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var thisArg = arguments[1];
			var k = 0;
			while (k < len) {
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return kValue;
				}
				k++;
			}
			return undefined;
		}
	});
}

if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function(s) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;
		};
}

if (typeof Object.assign !== 'function') {
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) {
			'use strict';
			if (target == null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}
			var to = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];
				if (nextSource != null) {
					for (var nextKey in nextSource) {
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

if (!Object.values) {
	Object.values = (function() {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		return function(obj) {
			if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}
			var result = [], prop, i;
			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(obj[prop]);
				}
			}
			return result;
		};
	}());
}

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}


function promisePolyfill () {
	function noop(){}function bind(e,n){return function(){e.apply(n,arguments)}}function Promise(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],doResolve(e,this)}function handle(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,Promise._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var o;try{o=t(e._value)}catch(e){return void reject(n.promise,e)}resolve(n.promise,o)}else(1===e._state?resolve:reject)(n.promise,e._value)})):e._deferreds.push(n)}function resolve(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if(n instanceof Promise)return e._state=3,e._value=n,void finale(e);if("function"==typeof t)return void doResolve(bind(t,n),e)}e._state=1,e._value=n,finale(e)}catch(n){reject(e,n)}}function reject(e,n){e._state=2,e._value=n,finale(e)}function finale(e){2===e._state&&0===e._deferreds.length&&Promise._immediateFn(function(){e._handled||Promise._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)handle(e,e._deferreds[n]);e._deferreds=null}function Handler(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function doResolve(e,n){var t=!1;try{e(function(e){t||(t=!0,resolve(n,e))},function(e){t||(t=!0,reject(n,e))})}catch(e){if(t)return;t=!0,reject(n,e)}}var setTimeoutFunc=setTimeout;Promise.prototype.catch=function(e){return this.then(null,e)},Promise.prototype.then=function(e,n){var t=new this.constructor(noop);return handle(this,new Handler(e,n,t)),t},Promise.all=function(e){var n=Array.prototype.slice.call(e);return new Promise(function(e,t){function o(r,s){try{if(s&&("object"==typeof s||"function"==typeof s)){var c=s.then;if("function"==typeof c)return void c.call(s,function(e){o(r,e)},t)}n[r]=s,0==--i&&e(n)}catch(e){t(e)}}if(0===n.length)return e([]);for(var i=n.length,r=0;r<n.length;r++)o(r,n[r])})},Promise.resolve=function(e){return e&&"object"==typeof e&&e.constructor===Promise?e:new Promise(function(n){n(e)})},Promise.reject=function(e){return new Promise(function(n,t){t(e)})},Promise.race=function(e){return new Promise(function(n,t){for(var o=0,i=e.length;o<i;o++)e[o].then(n,t)})},Promise._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){setTimeoutFunc(e,0)},Promise._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},Promise._setImmediateFn=function(e){Promise._immediateFn=e},Promise._setUnhandledRejectionFn=function(e){Promise._unhandledRejectionFn=e},window.Promise=Promise;
}
var supportsPromise = 'Promise' in window;
if (!supportsPromise) {
	promisePolyfill();
}
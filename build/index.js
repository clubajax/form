(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.dom = require('@clubajax/dom');
window.on = require('@clubajax/on');
window.nodash = require('@clubajax/no-dash');
const BaseComponent = require('@clubajax/base-component');
BaseComponent.destroyOnDisconnect = true;

require('../index');

},{"../index":2,"@clubajax/base-component":4,"@clubajax/dom":8,"@clubajax/no-dash":11,"@clubajax/on":12}],2:[function(require,module,exports){
require('./src/ui-input');
require('./src/ui-checkbox');
require('./src/ui-radio');
require('./src/ui-radio-buttons');
require('./src/ui-list');
require('./src/ui-popup');
require('./src/ui-dropdown');
require('./src/ui-search');
const iconMap = require('./src/lib/icon-map');

module.exports = {
    iconMap
};

},{"./src/lib/icon-map":15,"./src/ui-checkbox":17,"./src/ui-dropdown":18,"./src/ui-input":20,"./src/ui-list":21,"./src/ui-popup":22,"./src/ui-radio":24,"./src/ui-radio-buttons":23,"./src/ui-search":25}],3:[function(require,module,exports){
const on = require('@clubajax/on');

class BaseComponent extends HTMLElement {
	constructor () {
		super();
		this._uid = uid(this.localName);
		privates[this._uid] = { DOMSTATE: 'created' };
		privates[this._uid].handleList = [];
		plugin('init', this);
	}

	connectedCallback () {
		privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
		plugin('preConnected', this);
		nextTick(onCheckDomReady.bind(this));
		if (this.connected) {
			this.connected();
		}
		this.fire('connected');
		plugin('postConnected', this);
	}

	onConnected (callback) {
		if (this.DOMSTATE === 'connected' || this.DOMSTATE === 'domready') {
			callback(this);
			return;
		}
		this.once('connected', () => {
			callback(this);
		});
	}

	onDomReady (callback) {
		if (this.DOMSTATE === 'domready') {
			callback(this);
			return;
		}
		this.once('domready', () => {
			callback(this);
		});
	}

	disconnectedCallback () {
		privates[this._uid].DOMSTATE = 'disconnected';
		plugin('preDisconnected', this);
		if (this.disconnected) {
			this.disconnected();
		}
		this.fire('disconnected');

		let time, dod = BaseComponent.destroyOnDisconnect;
		if (dod) {
			time = typeof dod === 'number' ? doc : 300;
			setTimeout(() => {
				if (this.DOMSTATE === 'disconnected') {
					this.destroy();
				}
			}, time);
		}
	}

	attributeChangedCallback (attrName, oldVal, newVal) {
		if (!this.isSettingAttribute) {
			newVal = BaseComponent.normalize(newVal);
			plugin('preAttributeChanged', this, attrName, newVal, oldVal);
			if (this.attributeChanged && BaseComponent.normalize(oldVal) !== newVal) {
				this.attributeChanged(attrName, newVal, oldVal);
			}
		}
	}

	destroy () {
		this.fire('destroy');
		privates[this._uid].handleList.forEach(function (handle) {
			handle.remove();
		});
		destroy(this);
	}

	fire (eventName, eventDetail, bubbles) {
		return on.fire(this, eventName, eventDetail, bubbles);
	}

	emit (eventName, value) {
		return on.emit(this, eventName, value);
	}

	on (node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on(node, eventName, selector, callback) :
				on(this, node, eventName, selector));
	}

	once (node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on.once(node, eventName, selector, callback) :
				on.once(this, node, eventName, selector, callback));
	}

	attr (key, value, toggle) {
		this.isSettingAttribute = true;
		const add = toggle === undefined ? true : !!toggle;
		if (add) {
			this.setAttribute(key, value);
		} else {
			this.removeAttribute(key);
		}
		this.isSettingAttribute = false;
	}

	registerHandle (handle) {
		privates[this._uid].handleList.push(handle);
		return handle;
	}

	get DOMSTATE () {
		return privates[this._uid].DOMSTATE;
	}

	static set destroyOnDisconnect (value) {
		privates['destroyOnDisconnect'] = value;
	}

	static get destroyOnDisconnect () {
		return privates['destroyOnDisconnect'];
	}

	static clone (template) {
		if (template.content && template.content.children) {
			return document.importNode(template.content, true);
		}
		const frag = document.createDocumentFragment();
		const cloneNode = document.createElement('div');
		cloneNode.innerHTML = template.innerHTML;

		while (cloneNode.children.length) {
			frag.appendChild(cloneNode.children[0]);
		}
		return frag;
	}

	static addPlugin (plug) {
		let i, order = plug.order || 100;
		if (!plugins.length) {
			plugins.push(plug);
		}
		else if (plugins.length === 1) {
			if (plugins[0].order <= order) {
				plugins.push(plug);
			}
			else {
				plugins.unshift(plug);
			}
		}
		else if (plugins[0].order > order) {
			plugins.unshift(plug);
		}
		else {

			for (i = 1; i < plugins.length; i++) {
				if (order === plugins[i - 1].order || (order > plugins[i - 1].order && order < plugins[i].order)) {
					plugins.splice(i, 0, plug);
					return;
				}
			}
			// was not inserted...
			plugins.push(plug);
		}
	}
}

let
	privates = {},
	plugins = [];

function plugin (method, node, a, b, c) {
	plugins.forEach(function (plug) {
		if (plug[method]) {
			plug[method](node, a, b, c);
		}
	});
}

function onCheckDomReady () {
	if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
		return;
	}

	let
		count = 0,
		children = getChildCustomNodes(this),
		ourDomReady = onSelfDomReady.bind(this);

	function addReady () {
		count++;
		if (count === children.length) {
			ourDomReady();
		}
	}

	// If no children, we're good - leaf node. Commence with onDomReady
	//
	if (!children.length) {
		ourDomReady();
	}
	else {
		// else, wait for all children to fire their `ready` events
		//
		children.forEach(function (child) {
			// check if child is already ready
			// also check for connected - this handles moving a node from another node
			// NOPE, that failed. removed for now child.DOMSTATE === 'connected'
			if (child.DOMSTATE === 'domready') {
				addReady();
			}
			// if not, wait for event
			child.on('domready', addReady);
		});
	}
}

function onSelfDomReady () {
	privates[this._uid].DOMSTATE = 'domready';
	// domReady should only ever fire once
	privates[this._uid].domReadyFired = true;
	plugin('preDomReady', this);
	// call this.domReady first, so that the component
	// can finish initializing before firing any
	// subsequent events
	if (this.domReady) {
		this.domReady();
		this.domReady = function () {};
	}

	// allow component to fire this event
	// domReady() will still be called
	if (!this.fireOwnDomready) {
		this.fire('domready');
	}

	plugin('postDomReady', this);
}

function getChildCustomNodes (node) {
	// collect any children that are custom nodes
	// used to check if their dom is ready before
	// determining if this is ready
	let i, nodes = [];
	for (i = 0; i < node.children.length; i++) {
		if (node.children[i].nodeName.indexOf('-') > -1) {
			nodes.push(node.children[i]);
		}
	}
	return nodes;
}

function nextTick (cb) {
	requestAnimationFrame(cb);
}

const uids = {};
function uid (type = 'uid') {
	if (uids[type] === undefined) {
		uids[type] = 0;
	}
	const id = type + '-' + (uids[type] + 1);
	uids[type]++;
	return id;
}

const destroyer = document.createElement('div');
function destroy (node) {
	if (node) {
		destroyer.appendChild(node);
		destroyer.innerHTML = '';
	}
}

function makeGlobalListeners (name, eventName) {
	window[name] = function (nodeOrNodes, callback) {
		function handleDomReady (node, cb) {
			function onReady () {
				cb(node);
				node.removeEventListener(eventName, onReady);
			}

			if (node.DOMSTATE === eventName || node.DOMSTATE === 'domready') {
				cb(node);
			}
			else {
				node.addEventListener(eventName, onReady);
			}
		}

		if (!Array.isArray(nodeOrNodes)) {
			handleDomReady(nodeOrNodes, callback);
			return;
		}

		let count = 0;

		function onArrayNodeReady () {
			count++;
			if (count === nodeOrNodes.length) {
				callback(nodeOrNodes);
			}
		}

		for (let i = 0; i < nodeOrNodes.length; i++) {
			handleDomReady(nodeOrNodes[i], onArrayNodeReady);
		}
	};
}

makeGlobalListeners('onDomReady', 'domready');
makeGlobalListeners('onConnected', 'connected');

function testOptions(options) {
	const tests = {
		'prop': 'props',
		'bool': 'bools',
		'attr': 'attrs',
		'properties': 'props',
		'booleans': 'bools',
		'property': 'props',
		'boolean': 'bools'
	}
	Object.keys(tests).forEach((key) => { 
		if (options[key]) {
			console.error(`BaseComponent.define found "${key}"; Did you mean: "${tests[key]}"?` );
		}
	})
}

BaseComponent.injectProps = function (Constructor, { props = [], bools = [], attrs = [] }) {
	Constructor.bools = [...(Constructor.bools || []), ...bools];
	Constructor.props = [...(Constructor.props || []), ...props];
	Constructor.attrs = [...(Constructor.attrs || []), ...attrs];
	Constructor.observedAttributes = [...Constructor.bools, ...Constructor.props, ...Constructor.attrs];
};

BaseComponent.define = function (tagName, Constructor, options = {}) {
	testOptions(options);
	BaseComponent.injectProps(Constructor, options);
	customElements.define(tagName, Constructor);
	return Constructor;
};

module.exports = BaseComponent;
},{"@clubajax/on":12}],4:[function(require,module,exports){
module.exports = require('@clubajax/base-component/src/BaseComponent');
require('@clubajax/base-component/src/template');
require('@clubajax/base-component/src/properties');
require('@clubajax/base-component/src/refs');
},{"@clubajax/base-component/src/BaseComponent":3,"@clubajax/base-component/src/properties":5,"@clubajax/base-component/src/refs":6,"@clubajax/base-component/src/template":7}],5:[function(require,module,exports){
const BaseComponent = require('./BaseComponent');

function setBoolean (node, prop) {
	let propValue;
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			const att = this.getAttribute(prop);
			return (att !== undefined && att !== null && att !== 'false' && att !== false);
		},
		set (value) {
			this.isSettingAttribute = true;
			value = (value !== false && value !== null && value !== undefined);
			if (value) {
				this.setAttribute(prop, '');
			} else {
				this.removeAttribute(prop);
			}
			if (this.attributeChanged) {
				this.attributeChanged(prop, value);
			}
			const fn = this[onify(prop)];
			if (fn) {
				const eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
				window[eventName](this, () => {

					if (value !== undefined && propValue !== value) {
						value = fn.call(this, value) || value;
					}
					propValue = value;
				});
			}

			this.isSettingAttribute = false;
		}
	});
}

function setProperty (node, prop) {
	let propValue;
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
		},
		set (value) {
			this.isSettingAttribute = true;
			if (typeof value === 'object') {
				propValue = value;
			} else {
				this.setAttribute(prop, value);
				if (this.attributeChanged) {
					this.attributeChanged(prop, value);
				}
			}
			const fn = this[onify(prop)];
			if(fn){
				const eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
				window[eventName](this, () => {
					if(value !== undefined){
						propValue = value;
					}

					value = fn.call(this, value) || value;
				});
			}
			this.isSettingAttribute = false;
		}
	});
}

function setProperties (node) {
	let props = node.constructor.props || node.props;
	if (props) {
		props.forEach(function (prop) {
			if (prop === 'disabled') {
				setBoolean(node, prop);
			}
			else {
				setProperty(node, prop);
			}
		});
	}
}

function setBooleans (node) {
	let props = node.constructor.bools || node.bools;
	if (props) {
		props.forEach(function (prop) {
			setBoolean(node, prop);
		});
	}
}

function cap (name) {
	return name.substring(0,1).toUpperCase() + name.substring(1);
}

function onify (name) {
	return 'on' + name.split('-').map(word => cap(word)).join('');
}

function isBool (node, name) {
	return (node.bools || node.booleans || []).indexOf(name) > -1;
}

function boolNorm (value) {
	if(value === ''){
		return true;
	}
	return normalize(value);
}

function normalize(val) {
	if (typeof val === 'string') {
		val = val.trim();
		if (val === 'false') {
			return false;
		} else if (val === 'null') {
			return null;
		} else if (val === 'true') {
			return true;
		}
		// finds strings that start with numbers, but are not numbers:
		// '1team' '123 Street', '1-2-3', etc
		if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
			return val;
		}
	}
	if (!isNaN(parseFloat(val))) {
		return parseFloat(val);
	}
	return val;
}
BaseComponent.normalize = normalize;
BaseComponent.addPlugin({
	name: 'properties',
	order: 10,
	init: function (node) {
		setProperties(node);
		setBooleans(node);
	},
	preAttributeChanged: function (node, name, value) {
		if (node.isSettingAttribute) {
			return false;
		}
		if(isBool(node, name)){
			value = boolNorm(value);
			node[name] = !!value;
			if(!value){
				node[name] = false;
				node.isSettingAttribute = true;
				node.removeAttribute(name);
				node.isSettingAttribute = false;
			} else {
				node[name] = true;
			}
			return;
		}

		const v = normalize(value);

		node[name] = v;
	}
});
},{"./BaseComponent":3}],6:[function(require,module,exports){
const BaseComponent = require('./BaseComponent');

function assignRefs (node) {

    [...node.querySelectorAll('[ref]')].forEach(function (child) {
        let name = child.getAttribute('ref');
		child.removeAttribute('ref');
        node[name] = child;
    });
}

function assignEvents (node) {
    // <div on="click:onClick">
	[...node.querySelectorAll('[on]')].forEach(function (child, i, children) {
		if(child === node){
			return;
		}
		let
            keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
		// remove, so parent does not try to use it
		child.removeAttribute('on');

        node.on(child, event, function (e) {
            node[method](e)
        })
    });
}

BaseComponent.addPlugin({
    name: 'refs',
    order: 30,
    preConnected: function (node) {
        assignRefs(node);
        assignEvents(node);
    }
});
},{"./BaseComponent":3}],7:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');

const lightNodes = {};
const inserted = {};

function insert (node) {
    if(inserted[node._uid] || !hasTemplate(node)){
        return;
    }
    collectLightNodes(node);
    insertTemplate(node);
    inserted[node._uid] = true;
}

function collectLightNodes(node){
    lightNodes[node._uid] = lightNodes[node._uid] || [];
    while(node.childNodes.length){
        lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
    }
}

function hasTemplate (node) {
	return node.templateString || node.templateId;
}

function insertTemplateChain (node) {
    const templates = node.getTemplateChain();
    templates.reverse().forEach(function (template) {
        getContainer(node).appendChild(BaseComponent.clone(template));
    });
    insertChildren(node);
}

function insertTemplate (node) {
    if(node.nestedTemplate){
        insertTemplateChain(node);
        return;
    }
    const templateNode = node.getTemplateNode();

    if(templateNode) {
        node.appendChild(BaseComponent.clone(templateNode));
    }
    insertChildren(node);
}

function getContainer (node) {
    const containers = node.querySelectorAll('[ref="container"]');
    if(!containers || !containers.length){
        return node;
    }
    return containers[containers.length - 1];
}

function insertChildren (node) {
    let i;
	const container = getContainer(node);
	const children = lightNodes[node._uid];

    if(container && children && children.length){
        for(i = 0; i < children.length; i++){
            container.appendChild(children[i]);
        }
    }
}

function toDom (html){
	const node = document.createElement('div');
	node.innerHTML = html;
	return node.firstChild;
}

BaseComponent.prototype.getLightNodes = function () {
    return lightNodes[this._uid];
};

BaseComponent.prototype.getTemplateNode = function () {
    // caching causes different classes to pull the same template - wat?
    //if(!this.templateNode) {
	if (this.templateId) {
		this.templateNode = document.getElementById(this.templateId.replace('#',''));
	}
	else if (this.templateString) {
		this.templateNode = toDom('<template>' + this.templateString + '</template>');
	}
    //}
    return this.templateNode;
};

BaseComponent.prototype.getTemplateChain = function () {

    let
        context = this,
        templates = [],
        template;

    // walk the prototype chain; Babel doesn't allow using
    // `super` since we are outside of the Class
    while(context){
        context = Object.getPrototypeOf(context);
        if(!context){ break; }
        // skip prototypes without a template
        // (else it will pull an inherited template and cause duplicates)
        if(context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
            template = context.getTemplateNode();
            if (template) {
                templates.push(template);
            }
        }
    }
    return templates;
};

BaseComponent.addPlugin({
    name: 'template',
    order: 20,
    preConnected: function (node) {
        insert(node);
    }
});
},{"./BaseComponent":3}],8:[function(require,module,exports){
/* UMD.define */
(function (root, factory) {
	if (typeof customLoader === 'function') {
		customLoader(factory, 'dom');
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.returnExports = factory();
		window.dom = factory();
	}
}(this, function () {
	'use strict';
	var
		uids = {},
		destroyer = document.createElement('div');

	function isDimension (prop) {
		return !/opacity|index|flex|weight|^sdcsdcorder|tab|miter|group|zoom/i.test(prop)
	}

	function isNumber (value) {
		if (/\s/.test(value)) {
			return false;
		}
		return !isNaN(parseFloat(value));
	}

	function uid (type) {
		type = type || 'uid';
		if (uids[type] === undefined) {
			uids[type] = 0;
		}
		var id = type + '-' + (uids[type] + 1);
		uids[type]++;
		return id;
	}

	function isNode (item) {
		// safer test for custom elements in FF (with wc shim)
		// fragment is a special case
		return !!item && typeof item === 'object' && (typeof item.innerHTML === 'string' || item.nodeName === '#document-fragment');
	}

	function byId (item) {
		if (typeof item === 'string') {
			return document.getElementById(item);
		}
		return item;
	}

	function style (node, prop, value) {
		var computed, result;
		if (typeof prop === 'object') {
			// object setter
			Object.keys(prop).forEach(function (key) {
				style(node, key, prop[key]);
			});
			return null;
		} else if (value !== undefined) {
			// property setter
			if (typeof value === 'number' && isDimension(prop)) {
				value += 'px';
			}
			node.style[prop] = value;
		}

		// getter, if a simple style
		if (node.style[prop]) {
			result = node.style[prop];
			if (/px/.test(result)) {
				return parseFloat(result);
			}
			if (/%/.test(result)) {
				return parseFloat(result) * 0.01;
			}
			if (isNumber(result)) {
				return parseFloat(result);
			}
			return result;
		}

		// getter, computed
		computed = window.getComputedStyle(node);
		if (computed[prop]) {
			result = computed[prop];
			if (isNumber(result)) {
				return parseFloat(result);
			}
			return computed[prop];
		}
		return '';
	}

	function attr (node, prop, value) {
		if (typeof prop === 'object') {

			var bools = {};
			var strings = {};
			var objects = {};
			var events = {};
			var functions = {};
			Object.keys(prop).forEach(function (key) {
				if (typeof prop[key] === 'boolean') {
					bools[key] = prop[key];
				} else if (typeof prop[key] === 'object') {
					objects[key] = prop[key];
				} else if (typeof prop[key] === 'function') {
					if (/on[A-Z]/.test(key)) {
						events[key] = prop[key];
					} else {
						functions[key] = prop[key];
					}
				} else {
					strings[key] = prop[key];
				}
			});

			// assigning properties in specific order of type, namely objects last
			Object.keys(bools).forEach(function (key) { attr(node, key, prop[key]); });
			Object.keys(strings).forEach(function (key) { attr(node, key, prop[key]); });
			Object.keys(events).forEach(function (key) { attr(node, key, prop[key]); });
			Object.keys(objects).forEach(function (key) { attr(node, key, prop[key]); });
			Object.keys(functions).forEach(function (key) { attr(node, key, prop[key]); });

			return null;
		}
		else if (value !== undefined) {
			if (prop === 'text' || prop === 'html' || prop === 'innerHTML') {
				// ignore, handled during creation
				return;
			}
			else if (prop === 'className' || prop === 'class') {
				dom.classList.add(node, value);
			}
			else if (prop === 'style') {
				style(node, value);
			}
			else if (prop === 'attr') {
				// back compat
				attr(node, value);
			}
			else if (typeof value === 'function') {
				if (/on[A-Z]/.test(prop)) {
					attachEvent(node, prop, value);
				} else {
					node[prop] = value;
				}
			}
			else if (typeof value === 'object') {
				// object, like 'data'
				node[prop] = value;
			}
			else {
				if (value === false) {
					node.removeAttribute(prop);
				} else {
					node.setAttribute(prop, value);
				}
			}
		}

		return node.getAttribute(prop);
	}

	function attachEvent (node, prop, value) {
		var event = toEventName(prop);
		node.addEventListener(event, value);

		var callback = function (mutationsList) {
			mutationsList.forEach(function (mutation) {
				for (var i = 0; i < mutation.removedNodes.length; i++) {
					var n = mutation.removedNodes[i];
					if (n === node) {
						node.removeEventListener(event, value);
						observer.disconnect();
						break;
					}
				}
			});
		};
		var observer = new MutationObserver(callback);
		observer.observe(node.parentNode || document.body, { childList: true });
	}

	function box (node) {
		if (node === window) {
			node = document.documentElement;
		}
		// node dimensions
		// returned object is immutable
		// add scroll positioning and convenience abbreviations
		var
			dimensions = byId(node).getBoundingClientRect();
		return {
			top: dimensions.top,
			right: dimensions.right,
			bottom: dimensions.bottom,
			left: dimensions.left,
			height: dimensions.height,
			h: dimensions.height,
			width: dimensions.width,
			w: dimensions.width,
			scrollY: window.scrollY,
			scrollX: window.scrollX,
			x: dimensions.left + window.pageXOffset,
			y: dimensions.top + window.pageYOffset
		};
	}

	function relBox (node, parentNode) {
		var parent = parentNode || node.parentNode;
		var pBox = box(parent);
		var bx = box(node);

		return {
			w: bx.w,
			h: bx.h,
			x: bx.left - pBox.left,
			y: bx.top - pBox.top
		};
	}

	function size (node, type) {
		if (node === window) {
			node = document.documentElement;
		}
		if (type === 'scroll') {
			return {
				w: node.scrollWidth,
				h: node.scrollHeight
			};
		}
		if (type === 'client') {
			return {
				w: node.clientWidth,
				h: node.clientHeight
			};
		}
		return {
			w: node.offsetWidth,
			h: node.offsetHeight
		};
	}

	function query (node, selector) {
		if (!selector) {
			selector = node;
			node = document;
		}
		return node.querySelector(selector);
	}

	function queryAll (node, selector) {
		if (!selector) {
			selector = node;
			node = document;
		}
		var nodes = node.querySelectorAll(selector);

		if (!nodes.length) {
			return [];
		}

		// convert to Array and return it
		return Array.prototype.slice.call(nodes);
	}

	function toDom (html, options, parent) {
		var node = dom('div', { html: html });
		parent = byId(parent || options);
		if (parent) {
			while (node.firstChild) {
				parent.appendChild(node.firstChild);
			}
			return node.firstChild;
		}
		if (html.indexOf('<') !== 0) {
			return node;
		}
		return node.firstChild;
	}

	function fromDom (node) {
		function getAttrs (node) {
			var att, i, attrs = {};
			for (i = 0; i < node.attributes.length; i++) {
				att = node.attributes[i];
				attrs[att.localName] = normalize(att.value === '' ? true : att.value);
			}
			return attrs;
		}

		function getText (node) {
			var i, t, text = '';
			for (i = 0; i < node.childNodes.length; i++) {
				t = node.childNodes[i];
				if (t.nodeType === 3 && t.textContent.trim()) {
					text += t.textContent.trim();
				}
			}
			return text;
		}

		var i, object = getAttrs(node);
		object.text = getText(node);
		object.children = [];
		if (node.children.length) {
			for (i = 0; i < node.children.length; i++) {
				object.children.push(fromDom(node.children[i]));
			}
		}
		return object;
	}

	function addChildren (node, children) {
		if (Array.isArray(children)) {
			for (var i = 0; i < children.length; i++) {
				if (children[i]) {
					if (typeof children[i] === 'string') {
						node.appendChild(toDom(children[i]));
					} else {
						node.appendChild(children[i]);
					}
				}
			}
		}
		else if (children) {
			node.appendChild(children);
		}
	}

	function removeChildren (node) {
		var children = [];
		while (node.children.length) {
			var child = node.children[0];
			children.push(node.removeChild(child));
		}
		return children;
	}

	function addContent (node, options) {
		var html;
		if (options.html !== undefined || options.innerHTML !== undefined) {
			html = options.html || options.innerHTML || '';
			if (typeof html === 'object') {
				addChildren(node, html);
			} else {
				// careful assuming textContent -
				// misses some HTML, such as entities (&npsp;)
				node.innerHTML = html;
			}
		}
		if (options.text) {
			node.appendChild(document.createTextNode(options.text));
		}
		if (options.children) {
			addChildren(node, options.children);
		}
	}

	function dom (nodeType, options, parent, prepend) {
		options = options || {};

		// if first argument is a string and starts with <, pass to toDom()
		if (nodeType.indexOf('<') === 0) {
			return toDom(nodeType, options, parent);
		}

		var node = document.createElement(nodeType);

		parent = byId(parent);

		addContent(node, options);

		attr(node, options);

		if (parent && isNode(parent)) {
			if (prepend && parent.hasChildNodes()) {
				parent.insertBefore(node, parent.children[0]);
			} else {
				parent.appendChild(node);
			}
		}

		return node;
	}

	function insertAfter (refNode, node) {
		var sibling = refNode.nextElementSibling;
		if (!sibling) {
			refNode.parentNode.appendChild(node);
		} else {
			refNode.parentNode.insertBefore(node, sibling);
		}
		return sibling;
	}

	function place (parent, node, position) {
		if (!parent.children.length ||
			position === null ||
			position === undefined ||
			position === -1 ||
			position >= parent.children.length
		) {
			parent.appendChild(node);
			return;
		}
		parent.insertBefore(node, parent.children[position]);
	}

	function destroy (node) {
		// destroys a node completely
		//
		if (node) {
			node.destroyed = true;
			destroyer.appendChild(node);
			destroyer.innerHTML = '';
		}
	}

	function clean (node, dispose) {
		//	Removes all child nodes
		//		dispose: destroy child nodes
		if (dispose) {
			while (node.children.length) {
				destroy(node.children[0]);
			}
			return;
		}
		while (node.children.length) {
			node.removeChild(node.children[0]);
		}
	}

	dom.frag = function (nodes) {
		var frag = document.createDocumentFragment();
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				frag.appendChild(arguments[i]);
			}
		} else {
			if (Array.isArray(nodes)) {
				nodes.forEach(function (n) {
					frag.appendChild(n);
				});
			} else {
				frag.appendChild(nodes);
			}
		}
		return frag;
	};

	dom.classList = {
		// in addition to fixing IE11-toggle,
		// these methods also handle arrays
		remove: function (node, names) {
			toArray(names).forEach(function (name) {
				node.classList.remove(name);
			});
		},
		add: function (node, names) {
			toArray(names).forEach(function (name) {
				node.classList.add(name);
			});
		},
		contains: function (node, names) {
			return toArray(names).every(function (name) {
				return node.classList.contains(name);
			});
		},
		toggle: function (node, names, value) {
			names = toArray(names);
			if (typeof value === 'undefined') {
				// use standard functionality, supported by IE
				names.forEach(function (name) {
					node.classList.toggle(name, value);
				});
			}
			// IE11 does not support the second parameter
			else if (value) {
				names.forEach(function (name) {
					node.classList.add(name);
				});
			}
			else {
				names.forEach(function (name) {
					node.classList.remove(name);
				});
			}
		}
	};

	function normalize (val) {
		if (typeof val === 'string') {
			val = val.trim();
			if (val === 'false') {
				return false;
			} else if (val === 'null') {
				return null;
			} else if (val === 'true') {
				return true;
			}
			// finds strings that start with numbers, but are not numbers:
			// '2team' '123 Street', '1-2-3', etc
			if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
				return val;
			}
		}
		if (!isNaN(parseFloat(val))) {
			return parseFloat(val);
		}
		return val;
	}

	function toArray (names) {
		if (!names) {
			return [];
		}
		return names.split(' ').map(function (name) {
			return name.trim();
		}).filter(function (name) {
			return !!name;
		});
	}

	function toEventName (s) {
		s = s.replace('on', '');
		var str = '';
		for (var i = 0; i < s.length; i++) {
			if (i === 0 || s.charCodeAt(i) > 90) {
				str += s[i].toLowerCase();
			} else {
				str += '-' + s[i].toLowerCase();
			}
		}
		return str;
	}

	dom.normalize = normalize;
	dom.clean = clean;
	dom.query = query;
	dom.queryAll = queryAll;
	dom.byId = byId;
	dom.attr = attr;
	dom.box = box;
	dom.style = style;
	dom.destroy = destroy;
	dom.uid = uid;
	dom.isNode = isNode;
	dom.toDom = toDom;
	dom.fromDom = fromDom;
	dom.insertAfter = insertAfter;
	dom.size = size;
	dom.relBox = relBox;
	dom.place = place;
	dom.removeChildren = removeChildren;

	return dom;
}));

},{}],9:[function(require,module,exports){
(function (root, factory) {
	if (typeof customLoader === 'function') {
		customLoader(factory, 'on');
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.returnExports = window.on = factory();
	}
}(this, function () {
	'use strict';

	// main function

	function on (node, eventName, filter, handler) {
		// normalize parameters
		if (typeof node === 'string') {
			node = getNodeById(node);
		}

		// prepare a callback
		var callback = makeCallback(node, filter, handler);

		// functional event
		if (typeof eventName === 'function') {
			return eventName(node, callback);
		}

		// special case: keydown/keyup with a list of expected keys
		// TODO: consider replacing with an explicit event function:
		// var h = on(node, onKeyEvent('keyup', /Enter,Esc/), callback);
		var keyEvent = /^(keyup|keydown):(.+)$/.exec(eventName);
		if (keyEvent) {
			return onKeyEvent(keyEvent[1], new RegExp(keyEvent[2].split(',').join('|')))(node, callback);
		}

		// handle multiple event types, like: on(node, 'mouseup, mousedown', callback);
		if (/,/.test(eventName)) {
			return on.makeMultiHandle(eventName.split(',').map(function (name) {
				return name.trim();
			}).filter(function (name) {
				return name;
			}).map(function (name) {
				return on(node, name, callback);
			}));
		}

		// handle registered functional events
		if (Object.prototype.hasOwnProperty.call(on.events, eventName)) {
			return on.events[eventName](node, callback);
		}

		// special case: loading an image
		if (eventName === 'load' && node.tagName.toLowerCase() === 'img') {
			return onImageLoad(node, callback);
		}

		// special case: mousewheel
		if (eventName === 'wheel') {
			// pass through, but first curry callback to wheel events
			callback = normalizeWheelEvent(callback);
			if (!hasWheel) {
				// old Firefox, old IE, Chrome
				return on.makeMultiHandle([
					on(node, 'DOMMouseScroll', callback),
					on(node, 'mousewheel', callback)
				]);
			}
		}

		// special case: keyboard
		if (/^key/.test(eventName)) {
			callback = normalizeKeyEvent(callback);
		}

		// default case
		return on.onDomEvent(node, eventName, callback);
	}

	// registered functional events
	on.events = {
		// handle click and Enter
		button: function (node, callback) {
			return on.makeMultiHandle([
				on(node, 'click', callback),
				on(node, 'keyup:Enter', callback)
			]);
		},

		// custom - used for popups 'n stuff
		clickoff: function (node, callback) {
			// important note!
			// starts paused
			//
			var bHandle = on(node.ownerDocument.documentElement, 'click', function (e) {
				var target = e.target;
				if (target.nodeType !== 1) {
					target = target.parentNode;
				}
				if (target && !node.contains(target)) {
					callback(e);
				}
			});

			var handle = {
				state: 'resumed',
				resume: function () {
					setTimeout(function () {
						bHandle.resume();
					}, 100);
					this.state = 'resumed';
				},
				pause: function () {
					bHandle.pause();
					this.state = 'paused';
				},
				remove: function () {
					bHandle.remove();
					this.state = 'removed';
				}
			};
			handle.pause();

			return handle;
		}
	};

	// internal event handlers

	function onDomEvent (node, eventName, callback) {
		node.addEventListener(eventName, callback, false);
		return {
			remove: function () {
				node.removeEventListener(eventName, callback, false);
				node = callback = null;
				this.remove = this.pause = this.resume = function () {};
			},
			pause: function () {
				node.removeEventListener(eventName, callback, false);
			},
			resume: function () {
				node.addEventListener(eventName, callback, false);
			}
		};
	}

	function onImageLoad (node, callback) {
		var handle = on.makeMultiHandle([
			on.onDomEvent(node, 'load', onImageLoad),
			on(node, 'error', callback)
		]);

		return handle;

		function onImageLoad (e) {
			var interval = setInterval(function () {
				if (node.naturalWidth || node.naturalHeight) {
					clearInterval(interval);
					e.width  = e.naturalWidth  = node.naturalWidth;
					e.height = e.naturalHeight = node.naturalHeight;
					callback(e);
				}
			}, 100);
			handle.remove();
		}
	}

	function onKeyEvent (keyEventName, re) {
		return function onKeyHandler (node, callback) {
			return on(node, keyEventName, function onKey (e) {
				if (re.test(e.key)) {
					callback(e);
				}
			});
		};
	}

	// internal utilities

	var hasWheel = (function hasWheelTest () {
		var
			isIE = navigator.userAgent.indexOf('Trident') > -1,
			div = document.createElement('div');
		return "onwheel" in div || "wheel" in div ||
			(isIE && document.implementation.hasFeature("Events.wheel", "3.0")); // IE feature detection
	})();

	var matches;
	['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(function (name) {
		if (name.length < 7) { // prefix
			name += 'MatchesSelector';
		}
		if (Element.prototype[name]) {
			matches = name;
			return true;
		}
		return false;
	});

	function closest (element, selector, parent) {
		while (element) {
			if (element[on.matches] && element[on.matches](selector)) {
				return element;
			}
			if (element === parent) {
				break;
			}
			element = element.parentElement;
		}
		return null;
	}

	var INVALID_PROPS = {
		isTrusted: 1
	};
	function mix (object, value) {
		if (!value) {
			return object;
		}
		if (typeof value === 'object') {
			for(var key in value){
				if (!INVALID_PROPS[key]) {
					object[key] = value[key];
				}
			}
		} else {
			object.value = value;
		}
		return object;
	}

	var ieKeys = {
		//a: 'TEST',
		Up: 'ArrowUp',
		Down: 'ArrowDown',
		Left: 'ArrowLeft',
		Right: 'ArrowRight',
		Esc: 'Escape',
		Spacebar: ' ',
		Win: 'Command'
	};

	function normalizeKeyEvent (callback) {
		// IE uses old spec
		return function normalizeKeys (e) {
			if (ieKeys[e.key]) {
				var fakeEvent = mix({}, e);
				fakeEvent.key = ieKeys[e.key];
				callback(fakeEvent);
			} else {
				callback(e);
			}
		}
	}

	var
		FACTOR = navigator.userAgent.indexOf('Windows') > -1 ? 10 : 0.1,
		XLR8 = 0,
		mouseWheelHandle;

	function normalizeWheelEvent (callback) {
		// normalizes all browsers' events to a standard:
		// delta, wheelY, wheelX
		// also adds acceleration and deceleration to make
		// Mac and Windows behave similarly
		return function normalizeWheel (e) {
			XLR8 += FACTOR;
			var
				deltaY = Math.max(-1, Math.min(1, (e.wheelDeltaY || e.deltaY))),
				deltaX = Math.max(-10, Math.min(10, (e.wheelDeltaX || e.deltaX)));

			deltaY = deltaY <= 0 ? deltaY - XLR8 : deltaY + XLR8;

			e.delta  = deltaY;
			e.wheelY = deltaY;
			e.wheelX = deltaX;

			clearTimeout(mouseWheelHandle);
			mouseWheelHandle = setTimeout(function () {
				XLR8 = 0;
			}, 300);
			callback(e);
		};
	}

	function closestFilter (element, selector) {
		return function (e) {
			return on.closest(e.target, selector, element);
		};
	}

	function makeMultiHandle (handles) {
		return {
			state: 'resumed',
			remove: function () {
				handles.forEach(function (h) {
					// allow for a simple function in the list
					if (h.remove) {
						h.remove();
					} else if (typeof h === 'function') {
						h();
					}
				});
				handles = [];
				this.remove = this.pause = this.resume = function () {};
				this.state = 'removed';
			},
			pause: function () {
				handles.forEach(function (h) {
					if (h.pause) {
						h.pause();
					}
				});
				this.state = 'paused';
			},
			resume: function () {
				handles.forEach(function (h) {
					if (h.resume) {
						h.resume();
					}
				});
				this.state = 'resumed';
			}
		};
	}

	function getNodeById (id) {
		var node = document.getElementById(id);
		if (!node) {
			console.error('`on` Could not find:', id);
		}
		return node;
	}

	function makeCallback (node, filter, handler) {
		if (filter && handler) {
			if (typeof filter === 'string') {
				filter = closestFilter(node, filter);
			}
			return function (e) {
				var result = filter(e);
				if (result) {
					e.filteredTarget = result;
					handler(e, result);
				}
			};
		}
		return filter || handler;
	}

	function getDoc (node) {
		return node === document || node === window ? document : node.ownerDocument;
	}

	// public functions

	on.once = function (node, eventName, filter, callback) {
		var h;
		if (filter && callback) {
			h = on(node, eventName, filter, function once () {
				callback.apply(window, arguments);
				h.remove();
			});
		} else {
			h = on(node, eventName, function once () {
				filter.apply(window, arguments);
				h.remove();
			});
		}
		return h;
	};

	on.emit = function (node, eventName, value) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = getDoc(node).createEvent('HTMLEvents');
		event.initEvent(eventName, true, true); // event type, bubbling, cancelable
		return node.dispatchEvent(mix(event, value));
	};

	on.fire = function (node, eventName, eventDetail, bubbles) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = getDoc(node).createEvent('CustomEvent');
		event.initCustomEvent(eventName, !!bubbles, true, eventDetail); // event type, bubbling, cancelable, value
		return node.dispatchEvent(event);
	};

	// TODO: DEPRECATED
	on.isAlphaNumeric = function (str) {
		return /^[0-9a-z]$/i.test(str);
	};

	on.makeMultiHandle = makeMultiHandle;
	on.onDomEvent = onDomEvent; // use directly to prevent possible definition loops
	on.closest = closest;
	on.matches = matches;

	return on;
}));

},{}],10:[function(require,module,exports){
/* eslint-disable max-lines-per-function, object-shorthand, sort-vars, no-nested-ternary, indent, indent-legacy, complexity, no-plusplus, prefer-reflect*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['@clubajax/on'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('@clubajax/on'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
        root.keys = factory(root.on);
    }
}(this, function (on) {
    function keys(listNode, options) {

        options = options || {};

        const
            controller = {
                log: false,
                setSelected: function (node) {
                    select(node);
                },
                getSelected: function () {
                    return selected;
                },
                remove: function () {
                    this.destroy();
                },
                destroy: function () {
                    shift = false;
                    meta = false;
                    select();
                    unhighlight();
                    this.handles.forEach(function (h) {h.remove();});

                    if (observer) {
                        observer.disconnect();
                    }
                }
            },
            tableMode = listNode.localName === 'table',
            canSelectNone = options.canSelectNone !== undefined ? options.canSelectNone : true,
            multiple = options.multiple,
            searchStringTime = options.searchTime || 1000,
            externalSearch = options.externalSearch,
            // children is a live NodeList, so the reference will update if nodes are added or removed
            children = tableMode ? listNode.querySelectorAll('td') : listNode.children,
            button = options.buttonId ? document.getElementById(options.buttonId) : null;

        let
            shift = false,
            meta = false,
            observer,
            searchString = '',
            searchStringTimer,
            pivotNode,
            selected,
            highlighted;

        selected = select(getSelected(children, options));
        highlighted = highlight(fromArray(selected), options.defaultToFirst);

        const nodeType = (highlighted || children[0] || {}).localName || 'li';

        function unhighlight() {
            if (highlighted) {
                highlighted.removeAttribute('tab-index');
                highlighted.removeAttribute('aria-current');
                highlighted.blur();
            }
        }

        function highlight(node, defaultToFirst) {
            node = fromArray(node);
            unhighlight();
            if (!node) {
                if (!children[0] || !defaultToFirst) {
                    return null;
                }
                node = children[0];
            }
            highlighted = node;
            highlighted.setAttribute('tab-index', "-1");
            highlighted.setAttribute('aria-current', "true");
            highlighted.focus();
            on.fire(listNode, 'key-highlight', {value: highlighted}, true);
            return highlighted;
        }

        function select(node) {
            const clearSelection = !shift && !meta;
            if (clearSelection && selected) {
                toArray(selected).forEach(function (sel) {
                    sel.removeAttribute('aria-selected');
                });
                selected = multiple ? [] : null;
            }
            if (node && multiple) {
                selected = toArray(selected);
                if (shift && !Array.isArray(node)) {
                    selected = findShiftNodes(children, node, pivotNode);
                } else if (meta || shift) {
                    selected = [...selected, ...toArray(node)];
                    selected.forEach(function (sel) {
                        sel.setAttribute('aria-selected', 'true');
                    });
                } else if (Array.isArray(node)) {
                    selected = [];
                    node.forEach(function (n) {
                        n.setAttribute('aria-selected', 'true');
                    });
                    selected = selected.concat(node);
                } else if (node) {
                    node.setAttribute('aria-selected', 'true');
                    selected.push(node);
                }
            } else if (node) {
                if (selected) {
                    selected.removeAttribute('aria-selected');
                }
                if (node) {
                    selected = node;
                    selected.setAttribute('aria-selected', 'true');
                }
            }
            if (multiple && !selected) {
                selected = [];
            }
            on.fire(listNode, 'key-select', {value: selected || null}, true);

            return selected || null;
        }

        function scrollTo() {
            if (!highlighted) {
                return;
            }
            const top = highlighted.offsetTop;
            const height = highlighted.offsetHeight;
            const listHeight = listNode.offsetHeight;

            if (top - height < listNode.scrollTop) {
                listNode.scrollTop = top - height;
            } else if (top + (height * 2) > listNode.scrollTop + listHeight) {
                listNode.scrollTop = top - listHeight + (height * 2);
            }
        }
        function onKeyDown(e) {
            if (e.defaultPrevented) {
                return;
            }
            switch (e.key) {
                case 'Meta':
                case 'Control':
                case 'Command':
                    meta = true;
                    break;
                case 'Shift':
                    shift = true;
                    break;
                case 'Enter':
                    select(highlighted);
                    pivotNode = highlighted;
                    break;
                case 'Escape':
                    if (canSelectNone) {
                        select(null);
                    }
                    break;

                case 'ArrowDown':
                    if (tableMode) {
                        highlight(getCell(children, highlighted || selected, 'down'));
                        break;
                    } else {
                        const node = getNode(children, highlighted || selected, 'down');
                        highlight(node);
                        if (multiple && (shift || meta)) {
                            pivotNode = pivotNode || node;
                            select(node);
                        }
                    }
                    scrollTo();
                    e.preventDefault();
                // fallthrough
                case 'ArrowRight':
                    if (tableMode) {
                        highlight(getNode(children, highlighted || selected, 'down'));
                    }
                    break;

                case 'ArrowUp':
                    if (tableMode) {
                        highlight(getCell(children, highlighted || selected, 'up'));
                        e.preventDefault();
                        break;
                    } else {
                        const node = getNode(children, highlighted || selected, 'up');
                        highlight(node);
                        if (multiple && (shift || meta)) {
                            pivotNode = pivotNode || node;
                            select(node);
                        }
                    }
                    scrollTo();
                    e.preventDefault();
                // fallthrough
                case 'ArrowLeft':
                    if (tableMode) {
                        highlight(getNode(children, highlighted || selected, 'up'));
                    }
                    break;
                default:
                    break;
            }
        }

        function onInputSearch(e) {
            if (on.isAlphaNumeric(e.key) || e.key === 'Backspace' || e.key === 'Delete') {
                if (meta) {
                    return;
                }
                on.fire(button, 'key-search', { value: button.value });
            }
        }
        
        function onListSearch(e) {
            if (on.isAlphaNumeric(e.key)) {
                if (e.key === 'r' && meta) {
                    return;
                }
                searchString += e.key;
                const searchNode = searchHtmlContent(children, searchString);
                if (searchNode) {
                    highlight(select(searchNode));
                    scrollTo();
                }
            
                clearTimeout(searchStringTimer);
                searchStringTimer = setTimeout(function () {
                    searchString = '';
                }, searchStringTime);
            }
        }

        controller.handles = [
            on(listNode, 'mousedown', nodeType, function (e, node) {
                listNode.focus();
                highlight(node);
                select(node);
                e.preventDefault();
            }),
            on(listNode, 'mouseup', nodeType, function (e, node) {
                if (!shift && !meta) {
                    pivotNode = node;
                }
            }),
            on(document, 'keyup', function (e) {
                if (e.defaultPrevented) {
                    return;
                }
                shift = Boolean(e.shiftKey);
                meta = false;
            }),
            on(listNode, 'keydown', onKeyDown),
            on(listNode, 'keydown', onListSearch),
            on(listNode, 'blur', unhighlight),
            {
                pause: function () {if (controller.log) {console.log('pause');} },
                resume: function () {if (controller.log) {console.log('resume');} },
                remove: function () {if (controller.log) {console.log('remove');} }
            }
        ];

        if (button) {
            controller.handles.push(on(button, 'keydown', onKeyDown));
            if (externalSearch) {
                controller.handles.push(on(button, 'keyup', onInputSearch));
            }
        }

        if (!options.noRoles) {
            addRoles(listNode);
            if (typeof MutationObserver !== 'undefined') {
                observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (event) {
                        if (event.type === 'childList') {
                            on.fire(listNode, 'key-dom-change', event, true);
                        }
                        if (event.addedNodes.length) {
                            addRoles(listNode);
                        }
                    });
                });
                observer.observe(listNode, {childList: true});
            }
        }

        scrollTo();

        const multiHandle = on.makeMultiHandle(controller.handles);
        Object.keys(multiHandle).forEach(function (key) {
            controller[key] = multiHandle[key];
        });

        controller._resume = controller.resume;

        controller.resume = function () {
            scrollTo();
            controller._resume();
        };

        return controller;
    }

    function isSelected(node) {
        if (!node) {
            return false;
        }
        return node.hasAttribute('aria-selected');
    }

    function getSelected(children, options) {
        const mult = [];
        for (let i = 0; i < children.length; i++) {
            if (isSelected(children[i])) {
                if (options.multiple) {
                    mult.push(children[i]);
                } else {
                    return children[i];
                }
            }
        }
        return mult.length ? mult : options.defaultToFirst ? children[0] : null;
    }

    function getNext(children, index) {
        let norecurse = children.length + 2;
        let node = children[index];
        while (node) {
            index++;
            if (index > children.length - 1) {
                index = -1;
            } else if (isElligible(children, index)) {
                node = children[index];
                break;
            }
            if (norecurse-- < 0) {
                console.warn('recurse');
                return getFirstElligible(children);
            }
        }
        return node || children[0];
    }

    function getPrev(children, index) {
        let norecurse = children.length + 2;
        let node = children[index];
        while (node) {
            index--;
            if (index < 0) {
                index = children.length;
            } else if (isElligible(children, index)) {
                node = children[index];
                break;
            }
            if (norecurse-- < 0) {
                console.warn('recurse');
                return getLastElligible(children);
            }
        }
        return node || children[children.length - 1];
    }

    function isVisible(node) {
        return node.style.display !== 'none' && node.offsetHeight && node.offsetWidth;
    }

    function getFirstElligible(children) {
        for (let i = 0; i < children.length; i++) {
            if (isElligible(children, i)) {
                return children[i];
            }
        }
        return null;
    }

    function getLastElligible(children) {
        for (let i = children.length - 1; i >= 0; i--) {
            if (isElligible(children, i)) {
                return children[i];
            }
        }
        return null;
    }

    function isElligible(children, index) {
        return children[index] && !children[index].parentNode.disabled && isVisible(children[index]);
    }

    function getNode(children, highlighted, dir) {
        let index = -1;
        for (let i = 0; i < children.length; i++) {
            if (children[i] === highlighted) {
                index = i;
                break;
            }
        }
        if (dir === 'up') {
            return getPrev(children, index);
        }
        return getNext(children, index);
    }

    function getCell(children, highlighted, dir) {
        const
            cellIndex = getIndex(highlighted),
            row = highlighted.parentNode,
            rowIndex = getIndex(row),
            rowAmount = row.parentNode.rows.length;

        if (dir === 'up') {
            if (rowIndex > 0) {
                return row.parentNode.rows[rowIndex - 1].cells[cellIndex];
            }
            return row.parentNode.rows[rowAmount - 1].cells[cellIndex];
        }
        if (rowIndex + 1 < rowAmount) {
            return row.parentNode.rows[rowIndex + 1].cells[cellIndex];
        }
        return row.parentNode.rows[0].cells[cellIndex];
    }

    function getIndex(el) {
        let i, p = el.parentNode;
        for (i = 0; i < p.children.length; i++) {
            if (p.children[i] === el) {
                return i;
            }
        }
        return null;
    }

    function searchHtmlContent(children, str) {
        str = str.toLowerCase();
        for (let i = 0; i < children.length; i++) {
            if (children[i].innerHTML.toLowerCase().indexOf(str) === 0) {
                return children[i];
            }
        }
        return null;
    }

    function findShiftNodes(children, node, pivotNode) {
        const selection = [];
        if (!pivotNode) {
            toArray(node).forEach(function (n) {
                n.setAttribute('aria-selected', 'true');
                selection.push(n);
            });
            return selection;
        }
        const pivotIndex = getIndex(pivotNode);
        const newIndex = getIndex(node);
        let beg, end;
        if (newIndex < pivotIndex) {
            beg = newIndex;
            end = pivotIndex;
        } else {
            beg = pivotIndex;
            end = newIndex;
        }
        toArray(children).forEach(function (child, i) {
            if (i >= beg && i <= end) {
                child.setAttribute('aria-selected', 'true'); 
                selection.push(child);
            } else {
                child.removeAttribute('aria-selected');
            }
        });
        return selection;
    }

    function addRoles(node) {
        // https://www.w3.org/TR/wai-aria/roles#listbox
        for (let i = 0; i < node.children.length; i++) {
            node.children[i].setAttribute('role', 'listitem');
        }
        node.setAttribute('role', 'listbox');
    }

    function fromArray(thing) {
        return Array.isArray(thing) ? thing[0] : thing;
    }

    function toArray(thing) {
        if (!thing) {
            return [];
        }
        if (thing instanceof NodeList || thing instanceof HTMLCollection) {
            return Array.prototype.slice.call(thing);
        }
        return Array.isArray(thing) ? thing : [thing];
    }

    return keys;

}));

},{"@clubajax/on":9}],11:[function(require,module,exports){
(function (root, factory) {
	if (typeof customLoader === 'function'){ customLoader(factory, 'nodash'); }
	else if (typeof define === 'function' && define.amd){ define([], factory); }
	else if(typeof exports === 'object'){ module.exports = factory(); }
	else{ root.returnExports = factory();
		window.nodash = factory(); }
}(this, function () {

	const global = typeof window !== undefined ? window : global;

	// OBJECTS

	function copy (data) {
		if (!data) {
			return data;
		}
		const type = getType(data);
		if (type === 'array') {
			return data.map((item) => {
				if (item && typeof item === 'object') {
					return copy(item);
				}
				return item;
			});
		}

		if (type === 'html' || type === 'window') {
			throw new Error('HTMLElements and the window object cannot be copied');
		}

		if (type === 'date') {
			return new Date(data.getTime());
		}

		if (type === 'function') {
			return data;
		}

		if (type === 'map') {
			return new Map(data);
		}

		if (type === 'set') {
			return new Set(data);
		}

		if (type === 'object') {
			return Object.keys(data).reduce((obj, key) => {
				const item = data[key];
				if (typeof item === 'object') {
					obj[key] = copy(item);
				} else {
					obj[key] = data[key];
				}
				return obj;
			}, {});
		}
		return data;
	}

	function equal (a, b) {
		const typeA = getType(a);
		const typeB = getType(b);
		if (typeA !== typeB) {
			return false;
		}
		const type = typeA;
		if (/number|string|boolean/.test(type)){
			return a === b;
		}

		if (type === 'date') {
			return a.getTime() === b.getTime();
		}

		if (type === 'nan') {
			return true;
		}

		if (type === 'array') {
			return a.length === b.length && a.every((item, i) => {
				return equal(item, b[i]);
			});
		}

		if (type === 'object' || type === 'map' || type === 'set') {
			return Object.keys(a).every((key) => {
				return equal(a[key], b[key]);
			})
		}

		return a === b;
	}

	function getObject (o, path) {
		const paths = path.split('.');
		let value = o;
		let key;
		for (let i = 0; i < paths.length; i++) {
			key = paths[i];
			if (value[key] !== undefined) {
				value = value[key];
			} else {
				return null;
			}
		}
		return value;
	}

	function setObject (o, path, value) {
		return path.split('.').reduce((obj, key, i, array) => {
			if (i === array.length - 1) {
				obj[key] = value;
				return obj;
			}
			if (typeof obj[key] !== 'object') {
				if (isNaN(parseInt(key))) {
					obj[key] = {};
				} else {
					obj[key] = [];
				}
			}
			return obj[key];
		}, o);
	}

	// ARRAYS

	function equalValues (a, b) {
		const aTest = a.every(aItem => !!b.find(bItem => bItem === aItem));
		const bTest = b.every(bItem => !!a.find(aItem => aItem === bItem));
		return aTest && bTest;
	}

	function loop (count, callback) {
		for (let i = 0; i < count; i++) {
			callback(i);
		}
	}

	function remove (array, value) {
		array = [...array];
		for (let i = array.length - 1; i >= 0 ; i--) {
			if (value === array[i]) {
				array.splice(i, 1);
			}
		}
		return array;
	}

	function same (array, prop) {
		const getValue = item => prop ? item[prop] : item;
		const value = getValue(array[0]);
		for( let i = 0; i < array.length; i++ ) {
			if (!equal(getValue(array[i]), value)) {
				return false;
			}
		}
		return true;
	}

	function deDupe (array, prop) {
		const props = [];
		if (prop) {
			return array.filter((item) => {
				if (props.find(p => item[prop] === p)) {
					return false;
				}
				props.push(item[prop]);
				return true;
			});
		}
		return array.filter((item) => {
			if (props.find(p => item === p)) {
				return false;
			}
			props.push(item);
			return true;
		});
	}

	function sawLoop (collection, callback) {
		const result = [];
		collection[0].forEach((nada, valueIndex) => {
			collection.forEach((values, collectionIndex) => {
				const value = values[valueIndex];
				if (callback) {
					callback(value, valueIndex, collectionIndex);
				}
				result.push(value);
			});
		});
		return result;
	}

	function collectValues (arr, props) {

	}

	function collectProperties (item, props) {

	}

	// VALUES

	function getType (item) {

		if (item === null) {
			return 'null';
		}
		if (typeof item === 'object') {
			if (Array.isArray(item)) {
				return 'array';
			}
			if (item instanceof Date) {
				return 'date';
			}
			if (item instanceof Promise) {
				return 'promise';
			}
			if (item instanceof Error) {
				return 'error';
			}
			if (item instanceof Map) {
				return 'map';
			}
			if (item instanceof WeakMap) {
				return 'weakmap';
			}
			if (item instanceof Set) {
				return 'set';
			}
			if (item instanceof WeakSet) {
				return 'weakset';
			}
			if (item === global) {
				if (typeof window !== undefined) {
					return 'window';
				}
				return 'global';
			}
			if (item.documentElement || item.innerHTML !== undefined) {
				return 'html';
			}
			if(item.length !== undefined && item.callee) {
				return 'arguments'
			}
		}
		if (typeof item === 'number' && isNaN(item)) {
			return 'nan';
		}
		return typeof item;
	}

	// STRINGS

	function dashify (word) {
		return word.replace(/\s/g, '-').toLowerCase();
	}

	function cap (word) {
		return word.substring(0, 1).toUpperCase() + word.substring(1);
	}



	return {
		// objects
		copy,
		equal,
		getObject,
		setObject,

		// array
		equalValues,
		loop,
		deDupe,
		sawLoop,
		remove,
		same,

		// types
		getType,

		// string
		dashify,
		cap
	};

}));
},{}],12:[function(require,module,exports){
(function (root, factory) {
	if (typeof customLoader === 'function') {
		customLoader(factory, 'on');
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.returnExports = window.on = factory();
	}
}(this, function () {
	'use strict';

	// main function

	function on (node, eventName, filter, handler) {
		// normalize parameters
		if (typeof node === 'string') {
			node = getNodeById(node);
		}

		// prepare a callback
		var callback = makeCallback(node, filter, handler);

		// functional event
		if (typeof eventName === 'function') {
			return eventName(node, callback);
		}

		// special case: keydown/keyup with a list of expected keys
		// TODO: consider replacing with an explicit event function:
		// var h = on(node, onKeyEvent('keyup', /Enter,Esc/), callback);
		var keyEvent = /^(keyup|keydown):(.+)$/.exec(eventName);
		if (keyEvent) {
			return onKeyEvent(keyEvent[1], new RegExp(keyEvent[2].split(',').join('|')))(node, callback);
		}

		// handle multiple event types, like: on(node, 'mouseup, mousedown', callback);
		if (/,/.test(eventName)) {
			return on.makeMultiHandle(eventName.split(',').map(function (name) {
				return name.trim();
			}).filter(function (name) {
				return name;
			}).map(function (name) {
				return on(node, name, callback);
			}));
		}

		// handle registered functional events
		if (Object.prototype.hasOwnProperty.call(on.events, eventName)) {
			return on.events[eventName](node, callback);
		}

		// special case: loading an image
		if (eventName === 'load' && node.tagName.toLowerCase() === 'img') {
			return onImageLoad(node, callback);
		}

		// special case: mousewheel
		if (eventName === 'wheel') {
			// pass through, but first curry callback to wheel events
			callback = normalizeWheelEvent(callback);
			if (!hasWheel) {
				// old Firefox, old IE, Chrome
				return on.makeMultiHandle([
					on(node, 'DOMMouseScroll', callback),
					on(node, 'mousewheel', callback)
				]);
			}
		}

		// special case: keyboard
		if (/^key/.test(eventName)) {
			callback = normalizeKeyEvent(callback);
		}

		// default case
		return on.onDomEvent(node, eventName, callback);
	}

	// registered functional events
	on.events = {
		// handle click and Enter
		button: function (node, callback) {
			return on.makeMultiHandle([
				on(node, 'click', callback),
				on(node, 'keyup:Enter', callback)
			]);
		},

		// custom - used for popups 'n stuff
		clickoff: function (node, callback) {
			// important note!
			// starts paused
            //
            var nodeDoc = node.ownerDocument.documentElement;
            var bHandle = makeMultiHandle([
                on(nodeDoc, 'click', function (e) {
                    var target = e.target;
                    if (target.nodeType !== 1) {
                        target = target.parentNode;
                    }
                    if (target && !node.contains(target)) {
                        callback(e);
                    }
                }),
                on(nodeDoc, 'keyup', function (e) {
                    if (e.key === 'Escape') {
                        callback(e);
                    }
                })
            ]);
                

			var handle = {
				state: 'resumed',
				resume: function () {
					setTimeout(function () {
						bHandle.resume();
					}, 100);
					this.state = 'resumed';
				},
				pause: function () {
					bHandle.pause();
					this.state = 'paused';
				},
				remove: function () {
					bHandle.remove();
					this.state = 'removed';
				}
			};
			handle.pause();

			return handle;
		}
	};

	// internal event handlers

	function onDomEvent (node, eventName, callback) {
		node.addEventListener(eventName, callback, false);
		return {
			remove: function () {
				node.removeEventListener(eventName, callback, false);
				node = callback = null;
				this.remove = this.pause = this.resume = function () {};
			},
			pause: function () {
				node.removeEventListener(eventName, callback, false);
			},
			resume: function () {
				node.addEventListener(eventName, callback, false);
			}
		};
	}

	function onImageLoad (node, callback) {
		var handle = on.makeMultiHandle([
			on.onDomEvent(node, 'load', onImageLoad),
			on(node, 'error', callback)
		]);

		return handle;

		function onImageLoad (e) {
			var interval = setInterval(function () {
				if (node.naturalWidth || node.naturalHeight) {
					clearInterval(interval);
					e.width  = e.naturalWidth  = node.naturalWidth;
					e.height = e.naturalHeight = node.naturalHeight;
					callback(e);
				}
			}, 100);
			handle.remove();
		}
	}

	function onKeyEvent (keyEventName, re) {
		return function onKeyHandler (node, callback) {
			return on(node, keyEventName, function onKey (e) {
				if (re.test(e.key)) {
					callback(e);
				}
			});
		};
	}

	// internal utilities

	var hasWheel = (function hasWheelTest () {
		var
			isIE = navigator.userAgent.indexOf('Trident') > -1,
			div = document.createElement('div');
		return "onwheel" in div || "wheel" in div ||
			(isIE && document.implementation.hasFeature("Events.wheel", "3.0")); // IE feature detection
	})();

	var matches;
	['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(function (name) {
		if (name.length < 7) { // prefix
			name += 'MatchesSelector';
		}
		if (Element.prototype[name]) {
			matches = name;
			return true;
		}
		return false;
	});

	function closest (element, selector, parent) {
		while (element) {
			if (element[on.matches] && element[on.matches](selector)) {
				return element;
			}
			if (element === parent) {
				break;
			}
			element = element.parentElement;
		}
		return null;
	}

	var INVALID_PROPS = {
		isTrusted: 1
	};
	function mix (object, value) {
		if (!value) {
			return object;
		}
		if (typeof value === 'object') {
			for(var key in value){
				if (!INVALID_PROPS[key]) {
					object[key] = value[key];
				}
			}
		} else {
			object.value = value;
		}
		return object;
	}

	var ieKeys = {
		//a: 'TEST',
		Up: 'ArrowUp',
		Down: 'ArrowDown',
		Left: 'ArrowLeft',
		Right: 'ArrowRight',
		Esc: 'Escape',
		Spacebar: ' ',
		Win: 'Command'
	};

	function normalizeKeyEvent (callback) {
		// IE uses old spec
		return function normalizeKeys (e) {
			if (ieKeys[e.key]) {
				var fakeEvent = mix({}, e);
				fakeEvent.key = ieKeys[e.key];
				callback(fakeEvent);
			} else {
				callback(e);
			}
		}
	}

	var
		FACTOR = navigator.userAgent.indexOf('Windows') > -1 ? 10 : 0.1,
		XLR8 = 0,
		mouseWheelHandle;

	function normalizeWheelEvent (callback) {
		// normalizes all browsers' events to a standard:
		// delta, wheelY, wheelX
		// also adds acceleration and deceleration to make
		// Mac and Windows behave similarly
		return function normalizeWheel (e) {
			XLR8 += FACTOR;
			var
				deltaY = Math.max(-1, Math.min(1, (e.wheelDeltaY || e.deltaY))),
				deltaX = Math.max(-10, Math.min(10, (e.wheelDeltaX || e.deltaX)));

			deltaY = deltaY <= 0 ? deltaY - XLR8 : deltaY + XLR8;

			e.delta  = deltaY;
			e.wheelY = deltaY;
			e.wheelX = deltaX;

			clearTimeout(mouseWheelHandle);
			mouseWheelHandle = setTimeout(function () {
				XLR8 = 0;
			}, 300);
			callback(e);
		};
	}

	function closestFilter (element, selector) {
		return function (e) {
			return on.closest(e.target, selector, element);
		};
	}

	function makeMultiHandle (handles) {
		return {
			state: 'resumed',
			remove: function () {
				handles.forEach(function (h) {
					// allow for a simple function in the list
					if (h.remove) {
						h.remove();
					} else if (typeof h === 'function') {
						h();
					}
				});
				handles = [];
				this.remove = this.pause = this.resume = function () {};
				this.state = 'removed';
			},
			pause: function () {
				handles.forEach(function (h) {
					if (h.pause) {
						h.pause();
					}
				});
				this.state = 'paused';
			},
			resume: function () {
				handles.forEach(function (h) {
					if (h.resume) {
						h.resume();
					}
				});
				this.state = 'resumed';
			}
		};
	}

	function getNodeById (id) {
		var node = document.getElementById(id);
		if (!node) {
			console.error('`on` Could not find:', id);
		}
		return node;
	}

	function makeCallback (node, filter, handler) {
		if (filter && handler) {
			if (typeof filter === 'string') {
				filter = closestFilter(node, filter);
			}
			return function (e) {
				var result = filter(e);
				if (result) {
					e.filteredTarget = result;
					handler(e, result);
				}
			};
		}
		return filter || handler;
	}

	function getDoc (node) {
		return node === document || node === window ? document : node.ownerDocument;
	}

	// public functions

	on.once = function (node, eventName, filter, callback) {
		var h;
		if (filter && callback) {
			h = on(node, eventName, filter, function once () {
				callback.apply(window, arguments);
				h.remove();
			});
		} else {
			h = on(node, eventName, function once () {
				filter.apply(window, arguments);
				h.remove();
			});
		}
		return h;
	};

	on.emit = function (node, eventName, value) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = getDoc(node).createEvent('HTMLEvents');
		event.initEvent(eventName, true, true); // event type, bubbling, cancelable
		return node.dispatchEvent(mix(event, value));
	};

	on.fire = function (node, eventName, eventDetail, bubbles) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = getDoc(node).createEvent('CustomEvent');
		event.initCustomEvent(eventName, !!bubbles, true, eventDetail); // event type, bubbling, cancelable, value
		return node.dispatchEvent(event);
	};

	// TODO: DEPRECATED
	on.isAlphaNumeric = function (str) {
		return /^[0-9a-z]$/i.test(str);
	};

	on.makeMultiHandle = makeMultiHandle;
	on.onDomEvent = onDomEvent; // use directly to prevent possible definition loops
	on.closest = closest;
	on.matches = matches;

	return on;
}));

},{}],13:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const emitEvent = require('./emitEvent');

class FormElement extends BaseComponent {

    onReadonly(value) {
        if (this.input) {
            dom.attr(this.input, 'tabindex', '0', !value && !this.disabled);
        }
    }

    onDisabled(value) {
        if (this.input) {
            dom.attr(this.input, 'tabindex', '0', !value && !this.readonly);
        }
    }

    onLabel(value) {
        if (this.labelNode) {
            this.labelNode.innerHTML = value;
        }
    }

    canEmit() {
        return !this['no-event'] && !this.readonly && !this.disabled;
    }

    emitEvent() {
        const event = this.event || {
            value: this.value,
            name: this.name
        };
        emitEvent(this, event);
    }

}

module.exports = BaseComponent.define('ui-form-element', FormElement, {
    props: ['label', 'name', 'event-name', 'placeholder'],
    bools: ['no-event', 'disabled', 'readonly', 'autofocus', 'required'],
    attrs: ['value']
});

},{"./emitEvent":14,"@clubajax/base-component":4}],14:[function(require,module,exports){
const EVENT_NAME = 'change';
module.exports = function (instance, value) {
    if (instance.blockEvent) {
        return;
    }
    value = value === undefined ? instance.value : value;
    value = typeof value === 'object' ? value : {value};
    const eventName = instance['event-name'] || EVENT_NAME;
    const emitType = eventName === EVENT_NAME ? 'emit' : 'fire';
    instance[emitType](eventName, value, true);
    instance.__value = value.value;
};

},{}],15:[function(require,module,exports){
// https://fontawesome.com/icons?d=gallery&c=interfaces&m=free
const map = {
    check: 'fas fa-check',
    minus: 'fas fa-minus',
    plus: 'fas fa-plus',
    books: 'fas fa-book-reader',
    chess: 'fas fa-chess-rook',
    caretDown: 'fas fa-caret-down',
    search: 'fas fa-search',
    spinner: 'fas fa-sync-alt',

    'folder': 'far fa-folder',
    'file': 'far fa-file-alt',
    'file-archive': 'far fa-file-archive',
    'file-audio': 'far far fa-file-audio',
    'file-code': 'far far fa-file-code',
    'file-image': 'far far fa-file-image',
    'file-pdf': 'far far fa-file-pdf',
    'file-video': 'far far fa-file-video',
    'file-excel': 'far far fa-file-excel',
    'file-powerpoint': 'far far fa-file-powerpoint',
    'file-word': 'far far fa-file-word'
};


module.exports = map;

},{}],16:[function(require,module,exports){
const uidMap = {};
function uid (prefix = 'uid') {
	uidMap[prefix] = uidMap[prefix] || 0;
	uidMap[prefix]++;
	return `${prefix}-${uidMap[prefix]}`;
}

module.exports = uid;
},{}],17:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const FormElement = require('./lib/BaseField');
const uid = require('./lib/uid');
require('./ui-icon');

// CHECKED NOTE:!
// widget.checked *is* a getter/setter
// the visual keys off of the attribute
//
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

class CheckBox extends FormElement {

    get value() {
        return this.indeterminate ? null : Boolean(this.checked);
    }

    set value(value) {
        this.checked = value;
    }

    get event() {
        return {
            value: this.value,
            checked: this.checked,
            name: this.name
        }
    }

    onChecked(value) {
        if (this.indeterminate) {
            this.indeterminate = false;
            this.input.type = 'check';
        }
        dom.attr(this.input, 'aria-checked', `${value}`);
    }

    onIndeterminate(value) {
        if (value) {
            this.input.type = 'minus';
        }
    }

    setValue(value, silent) {
        this.value = value;
        if (!silent && this.canEmit()) {
            this.emitEvent();
        }
    }

    toggle() {
        this.checked = !this.checked;
        if (this.canEmit()) {
            this.emitEvent();
        } else {
            this.fire('toggle', {value: this.value});
        }
    }

    connected() {
        this.render();

        this.on('keyup', (e) => {
            if (!this.canEmit()) {
                return;
            }
            if (e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ') {
                this.toggle();
            }
        });
        this.on('click', (e) => {
            if (!this.canEmit()) {
                return;
            }
            this.toggle();
        });

        this.connected = () => {};
    }

    render() {
        const type = this.indeterminate ? 'minus' : 'check';
        const html = this.label || '';
        const chkId = this.label ? (this.id || uid('checkbox')) : null;
        const lblId = this.label ? (this.id || uid('label')) : null;

        this.input = dom('ui-icon', {type, id: chkId, role: 'checkbox', 'aria-labelledby': lblId, 'aria-checked': false, tabindex: '0'});
        this.labelNode = dom('span', {html, class: 'ui-label', 'for': chkId, id: lblId});

        if (this['check-after']) {
            this.appendChild(this.input);
            this.appendChild(this.labelNode);
        } else {
            this.appendChild(this.labelNode);
            this.appendChild(this.input);
        }

        dom.attr(this, 'label', false);
    }
}

module.exports = BaseComponent.define('ui-checkbox', CheckBox, {
    bools: ['checked', 'standards', 'check-after', 'indeterminate']
});

},{"./lib/BaseField":13,"./lib/uid":16,"./ui-icon":19,"@clubajax/base-component":4,"@clubajax/dom":8}],18:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');

// https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/

const DEFAULT_PLACEHOLDER = 'Select One...';

class UiDropdown extends BaseComponent {

    set value(value) {
        this.onDomReady(() => {
            this.list.value = value;
            this.setDisplay();
        });
        this.__value = value;
    }

    get value() {
        if (!this.list) {
            return this.__value || this.getAttribute('value');
        }
        return this.list.value;
    }

    set data(data) {
        this.onDomReady(() => {
            this.list.data = data;
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    setDisplay() {
        this.button.innerHTML = '';
        const item = this.list ? this.list.getItem(this.value) : {};
        this.__value = item ? item.value : this.__value;
        dom('span', {html: isNull(this.value) ? this.placeholder || DEFAULT_PLACEHOLDER : item.label}, this.button);
        dom('ui-icon', {type: 'caretDown'}, this.button);

        if (this.popup) {
            dom.style(this.popup, {
                'min-width': dom.box(this.button).w
            });
        }
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', (e) => {
            this.setDisplay();
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });
    }

    renderButton(buttonid) {
        this.button = dom('button', {id: buttonid, class: 'ui-button drop-input'}, this);
        this.setDisplay();
    }

    render() {
        this.labelNode = dom('label', {html: this.label, class: 'ui-label'}, this);
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            'event-name': 'list-change'
        });
        this.popup = dom('ui-popup', {
            buttonid,
            label: this.label,
            html: this.list
        }, document.body);
        this.setDisplay();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class'],
    bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
    attrs: ['value']
});

},{"./lib/uid":16,"./ui-icon":19,"./ui-list":21,"./ui-popup":22,"@clubajax/base-component":4,"@clubajax/dom":8}],19:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const iconMap = require('./lib/icon-map');

class Icon extends BaseComponent {
    onType(type) { 
        // if (!iconMap[type]) {
        //     console.warn('icon type missing:', type);
        // }
        if (!missingStylesheet()) {
            console.warn('Icon stylesheet missing');
        }
        this.className = iconMap[type] || type;
    }
}

module.exports = BaseComponent.define('ui-icon', Icon, {
    props: ['type']
});

let missing;
function missingStylesheet() {
    missing = missing !== undefined ? missing : Boolean(dom.queryAll('link').find(link => /fontawesome/.test(link.href)));
    return missing;
}

},{"./lib/icon-map":15,"@clubajax/base-component":4,"@clubajax/dom":8}],20:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const emitEvent = require('./lib/emitEvent');
require('./ui-icon');

const DEFAULT_PLACEHOLDER = 'Enter text...';

class UiInput extends BaseComponent {
    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this._value = value === undefined || value === null ? '' : value;
        this.setValue(this._value);
    }

    get value() {
        return this.input.value || null;
    }

    setValue(value) {
        if (this.input) {
            this.input.value = value;
            this.setPlaceholder();
        }
    }

    onIcon(type) {
        this.iconNode.type = type;
    }
    
    onLabel() {
        this.labelNode.innerHTML = this.label;
    }

    onDisabled(value) {
        if (this.input) {
            this.input.disabled = value;
        }
    }

    onReadonly(value) {
        if (this.input) {
            this.input.readonly = value;
        }
    }

    setPlaceholder() {
        // dom.classList.toggle(this, 'has-placeholder')
    }

    emitEvent(e) {
        e.stopPropagation();
        this._value = this.input.value;
        emitEvent(this, this._value);
    }

    connected() {
        this.render();
        this.connected = () => {};
    }

    connect() {
        this.on(this.input, 'blur', () => {
            this.focused = false;
            this.emit('blur');
        });
        this.on(this.input, 'focus', () => {
            this.focused = true;
            this.emit('focus');
        });
        this.on(this.input, 'change', this.emitEvent.bind(this));
    }

    render() {
        this.labelNode = dom('label', {}, this);
        this.input = dom('input', {
            value: this._value || '',
            readonly: this.readonly,
            disabled: this.disabled,
            placeholder: this.placeholder || DEFAULT_PLACEHOLDER
        }, this);
        if (this.icon) {
            this.iconNode = dom('ui-icon', {type: this.icon}, this);
            this.classList.add('has-icon');
        }
        this.setPlaceholder();
        this.connect();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-input', UiInput, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'icon'],
    bools: ['disabled', 'ready', 'required', 'autofocus'],
    attrs: ['value']
});

},{"./lib/emitEvent":14,"./ui-icon":19,"@clubajax/base-component":4,"@clubajax/dom":8}],21:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('./lib/emitEvent');

const ATTR = {
    SELECTED: 'aria-selected',
    DISABLED: 'disabled',
    TABINDEX: 'tabindex',
    VALUE: 'value'
};

// TODO
// divider
// group
// label
// disabled items
// a11y
// mobile

class UIList extends BaseComponent {
    constructor() {
        super();
    }

    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this.onConnected(() => {
            if (this.list) {
                if (Array.isArray(value)) {
                    if (!this.multiple) {
                        throw new Error('trying to set multiple values without the `multiple` attribute');
                    }
                    const selector = value.map(getSelector).join(',');
                    this.controller.setSelected(dom.queryAll(this, selector));
                } else {
                    this.controller.setSelected(dom.query(this, getSelector(value)));
                }
            }
        });
        this.__value = value;
    }

    get value() {
        if (!this.controller) {
            return this.__value || this.getAttribute('value');
        }
        if (this.multiple) {
            return this.controller.getSelected().map((node) => node.getAttribute('value'));
        }
        const node = this.controller.getSelected();
        if (node) {
            return node.getAttribute('value');
        }
        return this.__value || null;
    }

    set data(value) {
        if (typeof value === 'function') {
            this.lazyDataFN = value;
            this.onConnected(() => {
                this.connect();
            });
            return;
        }
        this.setData(value);
    }

    get data() {
        return this.items;
    }

    getItem(value) {
        return this.items ? this.items.find(item => item.value === value) : null;
    }

    onDisabled() {
        if (this.items || this.lazyDataFN) {
            this.connectEvents();
        }
    }

    onReadonly() {
        this.connectEvents();
    }

    setLazyValue(value) {
        // emits a value, in spite of the list not yet being rendered
        const data = this.lazyDataFN();
        const item = data.find(m => m.value === value);
        if (!item) {
            return;
        }
        this.emitEvent(value);
    }

    setLazyData() {
        // to be called externally, for example, by a dropdown
        this.setData(this.lazyDataFN());
        this.lazyDataFN = null;
        // I think this should be next:
        this.connectEvents();
        this.fire('dom-update');
    }

    setData(value) {
        value = Array.isArray(value) ? value : [value];
        if (value.length && typeof value[0] !== 'object') {
            value = value.map(item => ({label: item, value: item}));
        }
        if (!this.lazyDataFN) {
            this.__value = undefined;
        }
        this.selectedNode = null;
        this.update();
        this.items = [...value];
        if (/domready|connected/.test(this.DOMSTATE)) {
            this.setItemsFromData();
        }
    }

    addData(items) {
        items = Array.isArray(items) ? items : [items];
        this.items = [...(this.items || []), ...items];
        this.setItemsFromData();
    }

    removeData(value) {
        value = Array.isArray(value) ? value : [value];
        value.forEach((value) => {
            const index = this.items.findIndex(item => item.value === value);
            if (index === -1) {
                console.warn('remove value, not found', value);
            }
            this.items.splice(index, 1);
        });
        this.setItemsFromData();
    }

    connected() {
        if (this.lazyDataFN) {
            this.update();
        }
        if (this.items) {
            this.setItemsFromDom = () => {};
            this.setItemsFromData(true);
        }
    }

    domReady() {
        if (!this.disabled && !this.readyonly) {
            this.onDisabled();
        }
        if (this.items || this.lazyDataFN) {
            return;
        }
        this.setItemsFromDom();
    }

    setItemsFromDom() {
        // uses the children of ui-list as the items
        let postValue;
        const parentValue = this.value;
        this.render();
        this.items = [];
        while (this.children.length) {
            const child = this.children[0];
            if (child.localName !== 'li') {
                console.warn("ui-list children should use LI's");
            }
            this.items.push({
                label: child.textContent,
                value: child.getAttribute(ATTR.VALUE)
            });
            if (child.hasAttribute(ATTR.SELECTED) || child.getAttribute(ATTR.VALUE) === parentValue) {
                this.selectedNode = child;
                this.orgSelected = child;
                this.items[this.items.length - 1].selected = true;
                if (!parentValue) {
                    postValue = child.getAttribute(ATTR.VALUE);
                }
            }
            this.list.appendChild(child);
        }

        this.update();
        this.appendChild(this.list);
        this.connect();

        this.disabled = this.hasAttribute(ATTR.DISABLED);

        if (postValue || parentValue) {
            this.select(postValue || parentValue);
        }
    }

    setItemsFromData() {
        // uses an array of objects as the list items
        this.render();
        this.list.innerHTML = '';
        if (this.lazyDataFN && !this.items) {
            this.items = [];
        }
        if (dom.isNode(this.items[0])) {
            this.setDomData();
            return;
        }
        const parentValue = this.value;
        const list = this.list;
        let node;
        this.items.forEach(function (item) {
            const label = item.alias ? `${item.alias}: ${item.label}` : item.label;
            if (item.value === undefined && label === undefined) {
                throw new Error('[ERROR] each items must have a value or a label');
            }
            if (item.value === undefined) {
                node = dom('div', {class: 'label', html: label}, list);
                node.unselectable = true;
                return;
            }
            const options = {html: label, value: item.value};
            const isSelected = item.selected || item.value === parentValue;
            if (isSelected) {
                options['aria-selected'] = true;
            }
            if (item.class) {
                options.class = item.class;
            }
            if (item.disabled) {
                options.disabled = true;
            }
            node = dom('li', options, list);
        });
        this.appendChild(this.list);
        this.update();
        this.connect();
    }

    setDomData() {
        // uses array of objects which are dom nodes
        const list = this.list;
        this.items.forEach((node) => {
            if (node.localName !== 'li') {
                throw new Error('list children should be of type "li"');
            }
            if (!node.getAttribute('value')) {
                node.setAttribute('value', valueify(node.textContent));
            }
            list.appendChild(node);
        });
        this.appendChild(list);
        this.update();
        this.connect();
    }

    emitEvent() {
        // emits a "change" event
        emitEvent(this, this.value);
    }

    update() {
        // override me
        // called after items insertion, before list insertion
    }

    connect() {
        this.connectEvents();
        this.connect = function () {};
    }

    setTabIndicies(enabled) {
        if (!this.list) {
            return;
        }
        if (enabled) {
            this.setAttribute(ATTR.TABINDEX, '-1');
            this.list.setAttribute(ATTR.TABINDEX, '0');
        } else {
            this.removeAttribute(ATTR.TABINDEX);
            this.list.removeAttribute(ATTR.TABINDEX);
        }
    }

    connectEvents() {
        if (this.lazyDataFN) {
            return;
        }
        const enabled = !this.readonly && !this.disabled;
        this.setTabIndicies(enabled);
        if (!enabled && !this.controller) {
            return;
        }
        if (!enabled && this.controller) {
            this.controller.pause();
            this.connectHandles.pause();
        } else if (enabled && this.controller) {
            this.controller.resume();
            this.connectHandles.resume();
        } else {
            const options = {
                canSelectNone: this.getAttribute('can-select-none'),
                multiple: this.multiple,
                searchTime: this.getAttribute('search-time'),
                externalSearch: this['external-search'],
                buttonId: this.buttonid
            }
            this.controller = keys(this.list, options);
            // this.controller.log = true;

            this.connectHandles = on.makeMultiHandle([
                this.on('click', () => {
                    this.list.focus();
                }),
                this.on('focus', () => {
                    this.list.focus();
                }),
                this.on('key-select', () => {
                    this.emitEvent();
                })
            ]);
        }
    }

    reset() {
        console.log('RESET', this.__value);
        this.value = this.__value;
    }

    render() {
        if (!this.labelNode && this.label) {
            // TODO: a11y?
            this.labelNode = dom('label', {html: this.label}, this);
        }
        if (!this.list) {
            this.list = dom('ul', {});
        }
    }

    destroy() {
        super.destroy();
    }
}

function getSelector(val) {
    return `[value="${val}"]`;
}

function valueify(text) {
    return text.replace(/\s/g, '-').toLowerCase();
}

module.exports = BaseComponent.define('ui-list', UIList, {
    props: ['label', 'limit', 'name', 'event-name', 'align', 'buttonid', 'external-search'],
    bools: ['disabled', 'readonly', 'multiple'],
    attrs: ['value']
});

},{"./lib/emitEvent":14,"@clubajax/base-component":4,"@clubajax/dom":8,"@clubajax/key-nav":10,"@clubajax/on":12}],22:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');

class UiPopup extends BaseComponent {
    constructor() {
        super();
        this.handleMediaQuery = this.handleMediaQuery.bind(this);
    }

    domReady() {
        this.component = this.children[0] || {};
        this.button = dom.byId(this.buttonid);
        if (this.label) {
            this.labelNode = dom('label', {class: 'ui-label', html: this.label});
            dom.place(this, this.labelNode, 0);
        }
        dom('div', {
            class: 'ui-button-row',
            html: [
                dom('button', {html: 'Close', class: 'ui-button tertiary'}),
                dom('button', {html: 'Done', class: 'ui-button tertiary'})
            ]
        }, this);
        this.connectEvents();
        if (!this.parentNode) {
            document.body.appendChild(this);
        }

        this.mq = window.matchMedia('(max-width: 415px)');
        this.mq.addListener(this.handleMediaQuery);
        this.handleMediaQuery(this.mq);
    }

    connectEvents() {
        if (this.button) {
            if (this['use-hover']) {
                this.on(this.button, 'mouseenter', this.show.bind(this));
                this.on('mouseleave', this.hidden.bind(this));
            } else {
                this.removeClickOff = this.on(this, 'clickoff', () => {
                    this.hide();
                });
                this.on(this.button, 'click', () => {
                    this.removeClickOff.resume();
                    this.show();
                });
            }
        }
        dom.queryAll('.ui-button-row .ui-button').forEach((button, i) => {
            this.on(button, 'click', () => {
                if (i === 1) {
                    if (this.component.emitEvent) {
                        this.component.blockEvent = false;
                        this.component.emitEvent();
                        this.component.blockEvent = true;
                    }
                } else if (this.component.reset){
                    this.component.reset();
                }
                this.hide();
            });
        });
    }

    handleMediaQuery(event) {
        if (event.matches) {
            this.component.blockEvent = true;
            this.isMobile = true;
            clearPosition(this);
            this.classList.add('is-mobile');
        } else {
            this.component.blockEvent = false;
            this.isMobile = false;
            this.classList.remove('is-mobile');
            position(this, this.button);
        }
    }

    show() {
        this.classList.add('open');
        if (!this.isMobile) {
            position(this, this.button);
        }
    }

    hide() {
        this.classList.remove('open');
        if (this.removeClickOff) {
            this.removeClickOff.pause();
        }
    }

    destroy() {
        this.removeClickOff.remove();
        this.mq.removeListener(this.handleMediaQuery);
        super.destroy();
    }
}


function clearPosition(popup) {
    dom.style(popup, {
        left: '',
        right: '',
        top: '',
        bottom: '',
        height: '',
        overflow: ''
    });
}
function position(popup, button) {
    clearPosition(popup);
    const win = {
        w: window.innerWidth,
        h: window.innerHeight
    };
    const pop = dom.box(popup);
    const btn = dom.box(button);
    const GAP = 5;
    const MIN_BOT_SPACE = 200;
    const style = {};
    const leftAligned = btn.x + pop.w;
    const rightAligned = btn.x + btn.w - pop.w;

    const topSpace = btn.top;
    const botSpace = win.h - (btn.top + btn.h + GAP);
    
    if (this.align === 'right' || (leftAligned > win.w && rightAligned > 0)) {
        // right
        style.top = btn.y + btn.h;
        style.right = win.w - (btn.x + btn.w);
    } else if (leftAligned < win.w) {
        // left
        style.top = btn.y + btn.h;
        style.left = btn.x;
    }

    if (pop.h > topSpace && pop.h > botSpace) {
        if (botSpace < MIN_BOT_SPACE || topSpace > botSpace * 1.5 ) {
            // force top
            style.height = topSpace - (GAP * 2);
            style.bottom = (win.h - btn.y);
            style.top = '';
            style.overflow = 'auto';
        } else {
            // force bottom
            style.height = botSpace - (GAP * 2);
            style.overflow = 'auto';
        }
    } else if (botSpace < pop.h) {
        // bottom
        style.top = '';
        style.bottom = (win.h - btn.y);
    }

    dom.style(popup, style);
}

module.exports = BaseComponent.define('ui-popup', UiPopup, {
    props: ['buttonid', 'label', 'button-selector', 'event-name', 'align', 'use-hover']
});

},{"@clubajax/base-component":4,"@clubajax/dom":8}],23:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const nodash = require('@clubajax/no-dash');
const emitEvent = require('./lib/emitEvent');
const FormElement = require('./lib/BaseField');
require('./ui-radio');

class RadioButtons extends FormElement {

	constructor () {
		super();
		this.items = [];
		this.radios = [];
	}

	set data (items) {
		this.items = items;
		if (this.DOMSTATE === 'domready') {
			this.render();
		}
	}

	get data () {
		return this.items;
	}

	set value(value) {
		if (value === this.value) {
			return;
		}
		this.isSettingAttribute = true;
		this.setAttribute('value', sort(value));
		this.isSettingAttribute = false;
		this.setValue(value);
	}

	get value () {
		const value = dom.normalize(this.getAttribute('value'));
		if (this.type === 'checks') {
			return value.split(',');
		}
		return value;
	}

	set index (index) {
		this.onDomReady(() => {
			if (this.data) {
				this.value = this.data[index].value;
			}
		});
	}

	get index () {
		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i].value === this.value) {
				return i;
			}
		}
		return null;
	}

	domReady () {
		if (this.items) {
			this.render();
		}
	}

	setValue(value, silent) {
		this.onDomReady(() => {
			const isChk = this.type === 'checks';
			value = unDef(value) ? [] : Array.isArray(value) ? value : value.split(',');
			this.radios.forEach((radio) => {
				const radioValue = isChk ? radio.name : radio.value;
				if (radioValue === 0) {
					console.warn('values of `0` may not work as expected');
				}
				const checked = value.includes(radioValue);
				if (this.type === 'buttons') {
					dom.attr(radio, {
						checked,
						'aria-selected': checked ? 'true' : 'false'
					});
				} else {
					radio.checked = checked;
				}
			});

			if (!silent) {
				this.emitEvent();
			}
		});
	}

	add (item) {
		this.items.push(item);
		if (item.selected && this.type !== 'checks') {
			this.setValue(null, true);
			this.setAttribute('value', item.value);
		}
		this.addElement(item);
		this.connect();
	}

	addElement(item) {
		const isChk = this.type === 'checks';
		const isBtn = this.type === 'buttons';
		const localName = isBtn ? 'button' : isChk ? 'ui-checkbox' : 'ui-radio';
		const cls = isBtn ? 'btn' : isChk ? 'small' : '';
		const html = isBtn ? item.label : '';
		const value = this.value;
		const name = isChk ? item.value : this.name;
		const checked = !!(item.selected || (value && (!isChk ? value === item.value : value.includes(item.value))));
		this.radios.push(dom(localName, {
			name,
			html,
			checked,
			value: item.value,
			label: item.label,
			class: cls,
			'event-name': 'check-change'
		}, this));

		if (isBtn) {
			dom.attr(this.radios[this.radios.length - 1], 'aria-selected', checked ? 'true' : 'false');
		}
	}

	render () {
		this.innerHTML = '';
		this.radios = [];
		if (this.label) {
			this.labelNode = dom('label', { html: this.label, class: 'radio-buttons-label' }, this);
		}

		this.items.forEach((item) => {
			this.addElement(item);
		});

		this.connect();
	}

	emitEvent () {
		emitEvent(this, {
			value: this.value,
			index: this.index
		});
	}

	connect () {
		if (this.type === 'buttons') {
			this.connectButtons();
		} else if (this.type === 'checks') {
			this.connectChecks();
		} else {
			this.connectRadios();
		}
		this.connect = () => {};
	}

	onCheck(value, checked, silent) {
		const isBtn = this.type === 'buttons';
		const isChk = this.type === 'checks';
		const type = this.type || 'radios';
		const allowNone = this['allow-unchecked'];
		switch (type) {
			case 'checks':
				if (value) {
					if (checked) {
						this.value = nodash.deDupe([...this.value, value]);
					} else {
						this.value = nodash.remove(this.value, value);
					}
				} else if (allowNone) {
					this.value = null;
				} else {
					this.value = this.items[0].value;
				}
				break;
			case 'radios':
			case 'buttons':
				if (checked) {
					this.value = value;
				} else if (!checked && allowNone) {
					this.value = null;
				} else {
					this.setValue(value, true);
				}
				if (type === 'buttons') {

				}
				break;
		}
	}

	connectChecks () {
		this.on('check-change', (e) => {
			this.onCheck(e.target.getAttribute('name'), e.detail.value);
		});
	}

	connectRadios () {
		this.on('check-change', (e) => {
			this.onCheck(e.detail.value, e.target.checked);
		});
	}

	connectButtons () {
		const eventName = this.type === 'buttons' ? 'click' : 'check-change';
		this.on(eventName, (e) => {
			if (e.target.classList.contains('radio-buttons-label')) {
				return;
			}
			let value = e.target.value;
			const isChecked = e.target.getAttribute('checked');
			if (isChecked && this['allow-unchecked']) {
				value = null;
			}
			this.value = value;
		});
	}

}

function sort (value) {
	value = typeof value === 'string' ? value.split(',') : value;
	if (!Array.isArray(value)) {
		return value;
	}

	value.sort((a, b) => {
		if (a < b) {
			return -1;
		} else if (b < a) {
			return 1;
		}
		return 0;
	});

	return nodash.remove(value, '').join(',');
}

function unDef(value) { 
	return value === undefined || value === null;
}

module.exports = BaseComponent.define('ui-radio-buttons', RadioButtons, {
	props: ['type'],
	bools: ['allow-unchecked'],
	attrs: ['index']
});

},{"./lib/BaseField":13,"./lib/emitEvent":14,"./ui-radio":24,"@clubajax/base-component":4,"@clubajax/dom":8,"@clubajax/no-dash":11}],24:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const FormElement = require('./lib/BaseField');
const uid = require('./lib/uid');

class Radio extends FormElement {
    get event() {
        return {
            value: this.value,
            checked: this.checked,
            name: this.name
        }
    }

    onChecked(value) {
        dom.attr(this.input, 'aria-checked', `${value}`);
    }

    setValue(value, silent) {
        this.value = value;
        if (!silent && this.canEmit()) {
            this.emitEvent();
        }
    }

    toggle() {
        this.checked = !this.checked;
        if (this.canEmit()) {
            this.emitEvent();
        } else {
            this.fire('toggle', { value: this.value });
        }
    }

    connected() {
        this.render();
        this.on('keyup', (e) => {
            if (!this.canEmit()) {
                return;
            }
            if (e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ') {
                this.toggle();
            }
        });
        this.on('click', (e) => {
            if (!this.canEmit()) {
                return;
            }
            this.toggle();
        });
        this.connected = () => { };
    }

    render() {
        const html = this.label || '';
        const chkId = this.label ? (this.id || uid('radio')) : null;
        const lblId = this.label ? (this.id || uid('label')) : null;

        this.labelNode = dom('span', { html, class: 'ui-label', 'for': chkId, id: lblId });
        this.input = dom('div', { class: 'radio-button', id: chkId, role: 'radio', 'aria-labelledby': lblId, 'aria-checked': false, tabindex: '0' });
        
        if (this['check-after']) {
            this.appendChild(this.labelNode);
            this.appendChild(this.input);
        } else {
            this.appendChild(this.input);
            this.appendChild(this.labelNode);
        }

        dom.attr(this, 'label', false);
    }
}

module.exports = BaseComponent.define('ui-radio', Radio, {
    props: [],
    bools: ['checked', 'check-after'],
    attrs: []
});
},{"./lib/BaseField":13,"./lib/uid":16,"@clubajax/base-component":4,"@clubajax/dom":8}],25:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');
require('./ui-input');

// https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/

const DEFAULT_PLACEHOLDER = 'Begin typing...';

class UiSearch extends BaseComponent {
    set value(value) {
        this.onDomReady(() => {
            this.list.value = value;
            this.setDisplay();
        });
        this.__value = value;
    }

    get value() {
        if (!this.list) {
            return this.__value || this.getAttribute('value');
        }
        return this.list.value;
    }

    set data(data) {
        this.onDomReady(() => {
            this.list.data = data;
            if (this.input.focused) {
                this.popup.show();
            }
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    onBusy(value) {
        this.input.icon = value ? 'spinner' : 'search';
    }

    setDisplay() {
        const item = this.list ? this.list.getItem(this.value) : {};
        this.__value = item ? item.value : this.__value;

        this.input.value = isNull(this.value) ? '' : item.label;

        if (this.popup) {
            dom.style(this.popup, {
                'min-width': dom.box(this.input).w,
            });
        }
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', () => {
            this.setDisplay();
            this.emit('change', {value: this.value});
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });

        this.input.on('key-search', e => {
            this.fire('search', { value: e.detail.value });
        });

        this.input.on('focus', () => {
            this.classList.add('is-focused');
        });
        this.input.on('focus', () => {
            this.classList.remove('is-focused');
        });
    }

    renderButton(buttonid) {
        this.input = dom(
            'ui-input',
            {
                id: buttonid,
                'event-name': 'input-change',
                class: 'search-input',
                placeholder: this.placeholder || DEFAULT_PLACEHOLDER,
                icon: this.busy ? 'spinner' : 'search',
            },
            this
        );
        this.setDisplay();
    }

    render() {
        this.labelNode = dom(
            'label',
            { html: this.label, class: 'ui-label' },
            this
        );
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            'event-name': 'list-change',
            'external-search': true,
            buttonid,
        });
        this.popup = dom(
            'ui-popup',
            {
                buttonid,
                label: this.label,
                html: this.list,
            },
            document.body
        );
        this.setDisplay();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-search', UiSearch, {
    props: [
        'placeholder',
        'label',
        'limit',
        'name',
        'event-name',
        'align',
        'btn-class',
    ],
    bools: [
        'disabled',
        'open-when-blank',
        'allow-new',
        'required',
        'case-sensitive',
        'autofocus',
        'busy',
    ],
    attrs: ['value'],
});

},{"./lib/uid":16,"./ui-icon":19,"./ui-input":20,"./ui-list":21,"./ui-popup":22,"@clubajax/base-component":4,"@clubajax/dom":8}]},{},[1]);

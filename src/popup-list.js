const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('../../lib/emitEvent');
const autoId = require('../../lib/autoId');
const bindAll = require('../../lib/bindAll');

// TODO: ARIA, reset (w placeholder)

class PopupList extends BaseComponent {

	constructor () {
		super();
		this.open = false;
		this.selfOpen = true;
		this.emitItem = false;
		bindAll(this, 'toggle');
	}

	attributeChanged (prop, value) {
		if (prop === 'value') {
			this.value = value;
		}
	}

	set value (value) {

		this.onConnected(() => {
			if (this.popup) {
				this.select(value);
			} else if (this.lazyDataFN) {
				this.setLazyValue(value);
			}
			this.__value = value;
		});
	}

	get value () {
		return this.__value !== undefined ? this.__value : dom.normalize(this.getAttribute('value'));
	}

	set data (value) {
		if (typeof value === 'function') {
			this.lazyDataFN = value;
			this.onConnected(() => {
				this.connect();
			});
			return;
		}
		this.setData(value);
	}

	get data () {
		return this.items;
	}

	setLazyValue (value) {
		const data = this.lazyDataFN();
		const item = data.find(m => m.value === value);
		// console.log('setLazyValue', value, item, data);
		if (!item) {
			return;
		}
		this.button.innerHTML = item.label;
		this.emitEvent(value);
	}

	setData (value) {
		if (!Array.isArray(value)) {
			value = [value];
		}
		if (value.length && typeof value[0] !== 'object') {
			value = value.map(item => ({ label: item, value: item }));
		}
		if (!this.lazyDataFN) {
			this.__value = undefined;
		}
		this.selectedNode = null;
		this.update();
		this.items = value;
		if (this.DOMSTATE === 'domready' || this.DOMSTATE === 'connected') {
			this.setItemsFromData();
		}
	}

	onDisabled (value) {
		if (this.button) {
			this.button.disabled = !!value;
		}
		if (value) {
			this.removeAttribute('tabindex');
		} else {
			this.setAttribute('tabindex', '0');
		}
	}

	onPlaceholder (value) {
		if (!this.value) {
			this.button.innerHTML = value;
		}
	}

	connected () {
		if (this.lazyDataFN) {
			this.update();
		}
		if (!this.items) {
			return;
		}
		this.setItemsFromDom = () => {};
		this.setItemsFromData(true);
	}

	domReady () {
		if (this.items || this.lazyDataFN) {
			return;
		}
		this.setItemsFromDom();
	}

	setItemsFromDom () {
		let testId;
		let postValue;
		let hasChildren = false;
		const parentValue = this.value;
		if (this.button) {
			let testId = this.button.getAttribute('data-test-id');
			this.removeChild(this.button);
		}
		testId = testId ? `${testId}-popup` : autoId('popup');
		// TODO: in React, the UL may be set
		this.popup = dom('ul', { 'data-test-id': testId });

		while (this.children.length) {
			hasChildren = true;
			if (this.children[0].localName !== 'li') {
				console.warn("drop-down children should use LI's");
			}
			if (this.children[0].hasAttribute('selected') || this.children[0].getAttribute('value') === parentValue) {
				this.selectedNode = this.children[0];
				this.orgSelected = this.children[0];
				if (!parentValue) {
					postValue = this.children[0].getAttribute('value');
				}
			}
			this.popup.appendChild(this.children[0]);
		}

		this.update();
		if (this.button) {
			this.appendChild(this.button);
		}
		this.appendChild(this.popup);
		this.connect();

		this.disabled = this.hasAttribute('disabled');

		if (postValue || parentValue) {
			this.select(postValue || parentValue);
		}
	}

	setItemsFromData (silent) {
		let testId;
		if (!this.popup) {
			this.popup = dom('ul', { 'data-test-id': testId });
		}

		let postValue;
		const parentValue = this.value;
		const popup = this.popup;
		const self = this;
		let node;
		popup.innerHTML = '';
		this.items.forEach(function (item) {
			const label = item.alias ? `${item.alias}: ${item.label}` : item.label;
			if (item.value === undefined) {
				node = dom('div', { class: 'label', html: label }, popup);
				node.unselectable = true;
				return;
			}
			const options = { html: label, value: item.value };
			const isSelected = item.selected || item.value === parentValue;
			if (isSelected) {
				options.selected = true;
			}
			if (item.class) {
				options.class = item.class;
			}
			if (item.disabled) {
				options.disabled = true;
			}
			node = dom('li', options, popup);
			if (isSelected) {
				if (self.selectedNode) {
					self.selectedNode.removeAttribute('selected');
				}
				self.selectedNode = node;
				self.orgSelected = node;
				if (!parentValue) {
					self.__value = item.value;
				}
			}
		});
		this.appendChild(this.popup);
		this.update();
		this.connect();
	}

	getItem (value) {
		if (this.items) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value === value || this.items[i].label === value) {
					return this.items[i];
				}
			}
		}
		return null;
	}

	select (value, silent) {
		if (this.__value === value) {
			return;
		}
		const selected = this.selectedNode || dom.query(this.popup, '[selected]');
		if (selected) {
			selected.removeAttribute('selected');
		}
		this.selectedNode = dom.query(this.popup, `[value="${value}"]`);
		if (this.selectedNode) {
			this.selectedNode.setAttribute('selected', 'true');
		} else {
			value = null;
		}
		this.lastValue = this.__value;
		this.__value = value;
		this.update();
		if (!silent) {
			this.emitEvent(value);
		}
	}

	unselect () {
		if (this.selectedNode) {
			this.selectedNode.removeAttribute('selected');
		}
	}

	updateAfterListChange () {
		// TODO: doc this
		const parentValue = getValue(this);
		this.select(parentValue, true);
		this.hide();
	}

	emitEvent () {
		let value;
		if (this.emitItem) {
			value = this.getItem(this.value);
			if (value === null && this['allow-new']) {
				value = {
					label: this.value,
					value: this.value,
					isNew: true
				}
			}
		} else {
			value = this.value;
		}

		emitEvent(this, value);
	}

	isValid () {
		return true;
	}

	isValidSelection () {
		// override me
		return true;
	}

	update () {
		// override me
	}

	reset () {
		const value = this.orgSelected ? this.orgSelected : dom.normalize(this.getAttribute('value'));
		this.select(value);
	}

	undo () {
		if (this.lastValue !== undefined) {
			this.select(this.lastValue, true);
		}
	}

	toggle () {
		if (this.open) {
			this.hide();
		} else {
			this.show();
		}
	}

	show () {
		// console.log('show', this.items);
		// FIXME: was hiding drop if no items
		if (this.disabled) { // || !this.items || !this.items.length) {
			return;
		}
		if (this.lazyDataFN) {
			this.setData(this.lazyDataFN());
			this.connectList();
		}
		dom.style(this.popup, 'min-width', dom.box(this).w);
		this.open = true;
		this.classList.add('show');
		position.call(this);
		setTimeout(() => {
			// there is not a controller if a lazy list is unpopulated
			if (this.controller) {
				this.controller.resume();
				this.winHandle.resume();
			}
			this.fire('open');
		}, 30);
	}

	hide (timer = 0) {
		if (window.keepPopupsOpen) {
			return;
		}

		setTimeout(() => {
			if (this.open) {
				this.open = false;
				this.classList.remove('show');
				if (this.controller) {
					this.winHandle.pause();
					this.controller.pause();
				}
				clearHighlights(this);
				this.fire('close');
			}
		}, timer);
	}

	connect () {
		if (!this.button) {
			console.warn('no button to connect to', this._uid);
			return;
		}
		if (this.lazyDataFN) {
			this.on(this.button, 'click', () => {
				this.toggle();
			});
			this.on(this, 'keydown', (e) => {
				if (!this.open && (e.key === 'Enter' || e.key === 'ArrowDown')) {
					e.preventDefault();
					this.show();
				}
			});
		} else {
			this.connectBtn();
			this.connectList();
		}
		this.connect = function () {};
	}

	connectBtn () {
		if (this.selfOpen) {
			this.on(this.button, 'click', () => {
				this.toggle();
			});
			this.on(this, 'keydown', (e) => {
				if (!this.open && (e.key === 'Enter' || e.key === 'ArrowDown')) {
					e.preventDefault();
					this.show();
				}
			});
		}
	}

	connectList () {

		if (this.popup.children.length) {

			if (this.popHandle) {
				this.popHandle.remove();
			}
			if (this.winHandle) {
				this.winHandle.remove();
				this.controller.remove();
			}

			this.winHandle = on.makeMultiHandle([
				on(window, 'mouseup', (e) => {
					if (on.closest(e.target, this.localName, document.body) === this) {
						return true;
					}
					this.hide();
				}),
				on(window, 'keyup', (e) => {
					if (e.key === 'Escape') {
						this.hide();
					}
				}),
				on(this, 'blur', () => {
					this.hide();
				})
			]);
			const isInput = this.button.localName === 'input';
			this.controller = keys(this.popup, { roles: true, inputMode: isInput, noDefault: isInput });
			this.controller.pause();

			// listen here AFTER initializing keys, to prevent initial event
			this.popHandle = this.on(this.popup, 'key-select', (e) => {
				const node = e.detail.value;
				if (node && !node.hasAttribute('disabled')) {
					const value = getValue(node);
					this.select(value);
					this.hide();
				}
			});
			clearTimeout(this.warnTimer);

		} else {
			this.warnTimer = setTimeout(() => {
				console.log('nothing to connect', this._uid, this.button, this.items, this.popup.children.length);
			}, 150);
		}
	}

	destroy () {
		super.destroy();
	}
}

function position () {
	this.popup.classList.remove('right-aligned');
	this.popup.classList.remove('top-aligned');
	this.popup.classList.remove('center-aligned');
	dom.style(this.popup, {
		height: '',
		left: '',
		width: ''
	});
	const win = {
		w: window.innerWidth,
		h: window.innerHeight
	};
	const pop = dom.box(this.popup);
	const btn = dom.box(this.button);

	const leftAligned = btn.x + pop.w;
	const rightAligned = btn.x + btn.w - pop.w;

	const topSpace = btn.top;
	const botSpace = win.h - (btn.top + btn.h);

	if (this.align === 'right' || leftAligned > win.w && rightAligned > 0) {
		this.popup.classList.add('right-aligned');
	} else if (leftAligned < win.w) {
		this.popup.classList.remove('right-aligned');
	} else {
		this.popup.classList.add('center-aligned');
		const pad = dom.style(document.body, 'padding');
		let left, wpad;
		// FIXME
		// works for smart-ar - but what about right-aligned buttons?
		if (pad) {
			left = btn.x * -1 + pad;
			wpad = pad * 2;
		} else {
			left = btn.x * -1 + 10;
			wpad = 20;
		}
		dom.style(this.popup, {
			left,
			width: win.w - wpad
		});
	}

	if (pop.h > botSpace && pop.h < topSpace) {
		this.popup.classList.add('top-aligned');

	} else if (pop.h < botSpace) {
		this.popup.classList.remove('top-aligned');

	} else if (botSpace > topSpace) {
		// bottom, and scroll
		this.popup.classList.remove('top-aligned');
		dom.style(this.popup, 'height', botSpace - 100);
	} else {
		// top and scroll
		this.popup.classList.add('top-aligned');
		dom.style(this.popup, 'height', topSpace - 20);
	}
}

function clearHighlights (node) {
	dom.queryAll(node, 'li').forEach((li) => {
		li.removeAttribute('highlighted');
	})
}

function getValue (node) {
	return attr(node, 'value', 'defaultValue');
}

function attr (...args) {
	const node = args[0];
	let value;
	let i;
	for (i = 1; i < args.length; i++) {
		value = dom.normalize(node.getAttribute(args[i]));
		if (value !== null && value !== '') {
			return value;
		}
	}
	return null;
}

module.exports = BaseComponent.define('popup-list', PopupList, {
	props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class'],
	bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
	attrs: ['value']
});
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const PopupList = require('./popup-list');
const autoId = require('../../lib/autoId');
require('../icons/export');

// TODO: key handler, disabled, ARIA

class ActionButton extends PopupList {

	set value (value) {
		this.__value = value;
	}

	get value () {
		return this.__value;
	}

	onBusy (value) {
		this.renderButton();
	}

	constructor () {
		super();
	}

	connected () {
		this.renderButton();
		super.connected();
		if (this.data && this.data.some(item => item.callback)) {
			this.connectCallbacks();
		}
		this.connected = () => {};
	}

	renderButton () {
		let html;
		if(this.label){
			html = /icon/.test(this.label) ? dom(this.label, { class: 'icon-btn'}) : this.label
		} else {
			html = dom('icon-export');
		}
		const cls = this['btn-class'] || 'drop-btn';

		if (!this.button) {
			this.button = dom('button', {
				class: cls,
				'data-test-id': autoId(this),
				html: html,
				busy: this.busy,
				disabled: this.busy
			}, this);
		} else {
			this.button.innerHTML = html;
			this.button.className = cls;
			dom.attr(this.button, 'busy', this.busy);
			dom.attr(this.button, 'disabled', this.busy);
		}

	}

	select (value) {
		this.value = value;
		this.emitEvent();
	}

	connectCallbacks () {
		this.on('change', ({ value }) => {
			const item = this.data.find(m => m.value === value);
			if (item && item.callback) {
				item.callback(value);
			}
		});
	}

	destroy () {
		super.destroy();
	}
}

customElements.define('action-button', ActionButton);

module.exports = ActionButton;
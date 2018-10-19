const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const emitEvent = require('./lib/emitEvent');
require('./ca-icon');

const EVENT_NAME = 'change';

// CHECKED NOTE:!
//	widget.checked *is* a getter/setter
// the visual keys off of the attribute

class CheckBox extends BaseComponent {

	constructor () {
		super();
		this.connectedProps = true;
	}

	get value () {
		if (this['is-radio']) {
			return dom.normalize(this.getAttribute('value'));
		}
		return !!this.checked;
	}

	set value (value) {
		if (this['is-radio']) {
			this.setAttribute('value', value);
			// this.__value = value;
		} else {
			this.checked = value;
		}
	}

	onReadonly (value) {
		this.attr('tabindex', '0', !value && !this.disabled);
	}

	onDisabled (value) {
		this.attr('tabindex', '0', !value && !this.readonly);
	}

	onLabel (value) {
		this.labelNode.innerHTML = value;
	}

	setValue (value, silent) {
		this.value = value;
		if (!silent && this.canEmit()) {
			this.emitEvent();
		}
	}

	toggle () {
		this.checked = !this.checked;
		if (this.canEmit()) {
			this.emitEvent();
		} else {
			this.fire('toggle', { value: this.value });
		}
	}

	canEmit () {
		return !this['no-event'] && !this.readonly && !this.disabled;
	}

	emitEvent () {
		const value = this.value;
		emitEvent(this, {
			value,
			checked: value
		});
	}

	connected () {

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

	render () {

		this.labelNode = dom('span', {});
		dom('label', {
			html: [
				this['is-radio'] ? dom('div', { class: 'radio-button' }) : dom('ca-icon', { type: 'check'}),
				this.labelNode
			]
		}, this);

		if (!this.readonly && !this.disabled) {
			this.setAttribute('tabindex', '0');
		}
	}
}

module.exports = BaseComponent.define('ca-checkbox', CheckBox, {
	props: ['label', 'name', 'event-name'],
	bools: ['is-radio', 'no-event', 'disabled', 'readonly', 'checked'],
	attrs: []
});
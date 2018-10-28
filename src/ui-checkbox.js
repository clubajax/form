const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const uid = require('./lib/uid');
require('./ui-icon');
const FormElement = require('./FormElement');

const EVENT_NAME = 'change';

// CHECKED NOTE:!
//	widget.checked *is* a getter/setter
// the visual keys off of the attribute
//
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

// TODO:
// ADA - for:label
//
// inputInstance.indeterminate = true;
//
// if standards=true
// checked is on or off
// value should corespond to name:
// set value=foo
// set name=bar
// get value={bar:foo}
// set checked
//
// if standards=false
// value is boolean
// checked is boolean
// value===checked

class CheckBox extends FormElement {

	get value () {
		return this.indeterminate ? null : !!this.checked;
	}

	set value (value) {
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
			this.icon.type = 'check';
		}
	}

	onIndeterminate(value) { 
		if (value) {
			this.icon.type = 'minus';
		}
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

	render() {
		const type = this.indeterminate ? 'minus' : 'check';
		const html = this.label || '';
		if (this['check-after']) {
			this.labelNode = dom('label', { html }, this);
			this.icon = dom('ui-icon', { type }, this);
		} else {
			this.icon = dom('ui-icon', { type }, this);
			this.labelNode = dom('label', { html }, this);
		}

		if (!this.readonly && !this.disabled) {
			this.setAttribute('tabindex', '0');
		}
	}
}

module.exports = BaseComponent.define('ui-checkbox', CheckBox, {
	bools: ['checked', 'standards', 'check-after', 'indeterminate']
});
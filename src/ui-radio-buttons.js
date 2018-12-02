const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const nodash = require('@clubajax/no-dash');
const emitEvent = require('./lib/emitEvent');
const FormElement = require('./FormElement');
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
		// console.log(' ------- onCheck', value, checked);
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

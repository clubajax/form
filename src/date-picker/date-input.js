require('./date-picker');
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const dates = require('@clubajax/dates');
const util = require('./util');
const onKey = require('./onKey');
const isValid = require('./isValid');
// const focusManager = require('./focusManager');
const uid = require('../lib/uid');
require('../ui-popup');
require('../ui-icon');

const defaultPlaceholder = 'MM/DD/YYYY';
const defaultMask = 'XX/XX/XXXX';

const FLASH_TIME = 1000;

// BIG TODO:
// create a separate DIST for calendar
//
// TODO: 
//      disabled, read only
//      clean up unused properties
//      now for value (not just min & max)
// change 'static' property name
// mask throws errors


class DateInput extends BaseComponent {
	constructor () {
		super();
		this.dateType = 'date';
        this.showing = false;
        this.fireOwnDomready = true;
        this.static;
        this.labelNode;
        this.errorNode;
        this.input;
        this.hasTime;
        this.name;
        this.label;
        this.placeholder;
	}

	attributeChanged (name, value) {
		// need to manage value manually
        if (name === 'value') {
			this.value = value;
		}
	}

	set value (value) {
		if (value === this.strDate) {
			return;
		}
		const isInit = !this.strDate;
		value = dates.padded(value);

		this.strDate = dates.isValid(value) ? value : '';
		this.onDomReady(() => {
			this.setValue(this.strDate, isInit);
		});
	}

	get value () {
		return this.strDate;
	}

	get valid () {
		return this.isValid();
	}

	onLabel (value) {
		this.labelNode.innerHTML = value;
	}

    onMin(value) {
        if (!value || value === null) {
            return;
        }
        this.onDomReady(() => {
            console.log('MIN::', value, dates.toDate(value));
            this.minDate = util.getMinDate(value === 'now' ? new Date() : dates.toDate(value));
            this.picker.min = value;
        });
	}

    onMax(value) {
        if (!value || value === null) {
            return;
        }
        this.onDomReady(() => {
            this.maxDate = util.getMaxDate(value === 'now' ? new Date() : dates.toDate(value));
            this.picker.max = value;
        });
    }
    
    onValidation (e) {
        this.errorNode.innerHTML = e.detail.message || '';
    }

    get templateString() {
        this.buttonId = uid('button'); 
		return `
<label>
	<span ref="labelNode"></span>
	<div class="date-input-wrapper">
		<input ref="input" class="empty" />
        <button class="icon-button" id=${this.buttonId} ref="icon" aria-expanded="false" aria-label="Date Picker">
            <ui-icon type="calendar" />
        </button>
    </div>
    <div class="input-error" ref="errorNode"></div>
</label>`;
	}

	setValue (value, silent) {
		if (value === this.typedValue) {
			return;
		}
		if (this.dateType === 'datetime' && value.length === 10 && this.typedValue.length > 16) { // 19 total
			value = util.mergeTime(value, this.typedValue);
		}
		value = this.format(value);
		this.typedValue = value;
		this.input.value = value;
        const valid = this.validate();
		if (valid) {
			this.strDate = value;
			this.picker.value = value;
			if (!silent) {
				this.emitEvent();
			}
		}

		if (!silent && valid) {
			setTimeout(this.hide.bind(this), 300);
		}
		return value;
	}

	emitEvent () {
		const value = this.value;
		if (value === this.lastValue || !this.isValid(value)) {
			return;
		}
		this.lastValue = value;
		this.emit('change', { value });
	}

	format (value) {
		return  util.formatDate(value, this.mask);
	}

	isValid (value = this.input.value) {
		return isValid.call(this, value, this.dateType);
	}

	validate () {
		if (this.isValid()) {
			this.classList.remove('invalid');
			return true;
		}
		this.classList.add('invalid');
		return false;
	}

	flash (addFocus) {
		this.classList.add('warning');
		setTimeout(() => {
			this.classList.remove('warning');
		}, FLASH_TIME);

		if(addFocus){
			this.focus();
		}
	}

	show () {
		if (this.showing) {
			return;
        }
        this.popup.show();
		this.showing = true;
		this.picker.onShow();
        this.picker.classList.add('show');
        this.picker.focus();
	}

	hide () {
        if (this.static || !this.showing || window.keepPopupsOpen) {
			return;
        }
        this.popup.hide();
		this.showing = false;
		this.picker.onHide();
	}

	focus () {
		this.onDomReady(() => {
			this.input.focus();
		});
	}

	blur () {
		if (this.input) {
			this.input.blur();
		}
	}

    onBlur() {
		const valid = this.validate();
		if (valid) {
			this.emitEvent();
		} else {
			this.reset();
        }
        this.emit('blur');
	}

	reset () {
		this.typedValue = '';
		this.setValue(this.strDate || '', true);
	}

    domReady() {
		this.time = this.time || this.hasTime;
		this.mask = this.mask || defaultMask;
		this.input.setAttribute('type', 'text');
		this.input.setAttribute('placeholder', this.placeholder || defaultPlaceholder);
		if (this.name) {
			this.input.setAttribute('name', this.name);
		}
		if (this.label) {
			this.labelNode.innerHTML = this.label;
		}
		this.connectKeys();

        this.popup = dom('ui-popup', {buttonid: this.buttonId, class: 'ui-date-input'}, document.body);
        this.picker = dom('date-picker', {time: this.time, tabindex: '0', 'event-name': 'date-change'}, this.popup);
        
        this.picker.onDomReady(() => {
			this.picker.on('date-change', (e) => {
                this.setValue(e.detail.value, e.detail.silent);
                this.hide();
            });
            this.popup.on('popup-open', () => {
                this.show();
            });
        });
        
        window.onDomReady([this.picker, this.popup], () => {
            if (this.static) {
                this.show();
            }
            this.fire('domready');
        })
	}

	connectKeys () {
		this.on(this.input, 'keypress', util.stopEvent);
		this.on(this.input, 'keyup', (e) => {
			onKey.call(this, e, this.dateType);
		});
        this.on(this.input, 'blur', this.onBlur.bind(this));
        this.on(this, 'validation', this.onValidation.bind(this));
	}

	destroy () {
		if (this.focusHandle) {
			this.focusHandle.remove();
		}
	}
}

module.exports = BaseComponent.define('date-input', DateInput, {
	bools: ['required', 'time', 'static'],
	props: ['label', 'name', 'placeholder', 'mask', 'min', 'max', 'time', 'validation'],
	attrs: ['value']
});

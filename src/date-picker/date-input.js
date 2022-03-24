require('./date-picker');
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const dates = require('@clubajax/dates');
const util = require('./util');
const onKey = require('./onKey');
const isValid = require('./isValid');
const uid = require('../lib/uid');
require('./date-picker');
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
    constructor() {
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

    attributeChanged(name, value) {
        // need to manage value manually
        if (name === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        if (value === this.strDate) {
            return;
        }
        if (value === 'today') {
            value = dates.format(new Date(), 'MM/dd/yyyy')
        }
        const isInit = !this.strDate;
        value = dates.padded(value);

        this.strDate = dates.isValid(value) ? value : '';
        this.onDomReady(() => {
            this.setValue(this.strDate, true);
        });
    }

    get value() {
        return this.strDate;
    }

    get valid() {
        return this.isValid();
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

    onLabel(value) {
        this.labelNode.innerHTML = value;
    }

    onMin(value) {
        if (!value || value === null) {
            return;
        }
        this.onDomReady(() => {
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

    onValidation(e) {
        this.errorNode.innerHTML = e.detail.message || '';
    }

    get templateString() {
        this.buttonId = uid('button');
        return `
<label>
	<span ref="labelNode"></span>
	<div class="date-input-wrapper" ref="wrapper">
		<input ref="input" class="empty" />
        <button class="icon-button" id=${this.buttonId} ref="icon" aria-expanded="false" aria-label="Date Picker">
            <ui-icon type="calendar" />
        </button>
    </div>
    <div class="input-error" ref="errorNode"></div>
</label>`;
    }

    setValue(value, silent) {
        if (value === this.typedValue) {
            return;
        }
        if (this.dateType === 'datetime' && value.length === 10 && this.typedValue.length > 16) {
            // 19 total
            value = util.mergeTime(value, this.typedValue);
        }
        const formatted = this.format(value);
        this.typedValue = formatted;
        this.input.value = formatted;
        const valid = this.validate();
        if (valid) {
            this.strDate = formatted;
            this.picker.value = formatted;
            if (!silent) {
                this.emitEvent();
            }
        }

        if (!silent && valid) {
            setTimeout(this.hide.bind(this), 300);
        }
        return formatted;
    }

    emitEvent() {
        const value = this.value;
        if (value === this.lastValue || !this.isValid(value)) {
            return;
        }
        this.lastValue = value;
        this.emit('change', { value });
    }

    format(value) {
        return util.formatDate(value, this.mask);
    }

    isValid(value = this.input.value) {
        return isValid.call(this, value, this.dateType);
    }

    validate() {
        if (this.isValid()) {
            this.classList.remove('invalid');
            return true;
        }
        this.classList.add('invalid');
        return false;
    }

    flash(addFocus) {
        this.classList.add('warning');
        setTimeout(() => {
            this.classList.remove('warning');
        }, FLASH_TIME);

        if (addFocus) {
            this.focus();
        }
    }

    show() {
        if (this.showing) {
            return;
        }
        this.popup.show();
        this.showing = true;
        this.picker.onShow();
        this.picker.classList.add('show');
        this.picker.focus();
    }

    hide() {
        if (this.static || !this.showing || window.keepPopupsOpen) {
            return;
        }
        this.popup.hide();
        this.showing = false;
        this.picker.onHide();
        this.icon.focus();
    }

    focus() {
        this.onDomReady(() => {
            this.input.focus();
        });
    }

    blur() {
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

    reset() {
        this.typedValue = '';
        this.setValue(this.strDate || '', true);
    }

    domReady() {
        if (!this.label) {
            // this.removeChild(this.wrapper);
            this.innerHTML = '';
            this.appendChild(this.wrapper);
        }
        this.time = this.time || this.hasTime;
        this.mask = this.mask || defaultMask;
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('placeholder', this.placeholder || defaultPlaceholder);
        this.input.setAttribute('disabled', this.disabled || null);
        this.input.setAttribute('readonly', this.readonly || null);
        if (this.labelId) {
            this.input.setAttribute('id', this.labelId);
        }

        dom.attr(this.input, 'disabled', this.disabled);
        dom.attr(this.input, 'readonly', this.readonly);

        if (this.name) {
            this.input.setAttribute('name', this.name);
        }
        if (this.label) {
            this.labelNode.innerHTML = this.label;
        } else {
            this.labelNode.parentNode.removeChild(this.labelNode);
        }
        this.connectKeys();

        this.popup = dom('ui-popup', { buttonid: this.buttonId, class: 'ui-date-input', lazy: true }, document.body);
        this.popup.noHideOnBlur = true;
        this.picker = dom('date-picker', { time: this.time, tabindex: '0', 'event-name': 'date-change' }, this.popup);

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
        });
    }

    connectKeys() {
        let isMeta;
        let isPaste;
        this.on(this.input, 'keypress', util.stopEvent, null);
        this.on(this.input, 'keyup', (e) => {
            if (e.key === 'Meta') {
                isMeta = false;
            }
            if (isPaste) {
                console.log('PASTE', this.input.value);
                isPaste = false;
                this.setValue(this.input.value);
            } else {
                onKey.call(this, e, this.dateType);
            }
        }, null);
        this.on(this.input, 'keydown', (e) => {
            if (e.key === 'Meta') {
                isMeta = true;
            }
            if (!e.key || e.key.toLowerCase() === 'v' && isMeta) {
                // no key means native autocomplete
                isPaste = true;
            }
        }, null);
        this.on(this.input, 'blur', this.onBlur.bind(this), null);
        this.on(this, 'validation', this.onValidation.bind(this), null);
    }

    destroy() {
        if (this.focusHandle) {
            this.focusHandle.remove();
        }
        if (this.popup) {
            this.popup.destroy();
        }
        if (this.picker) {
            this.picker.destroy();
        }
        super.destroy();
    }
}

module.exports = BaseComponent.define('date-input', DateInput, {
    bools: ['required', 'disabled', 'readonly', 'time', 'static'],
    props: ['label', 'name', 'placeholder', 'mask', 'min', 'max', 'time', 'validation', 'labelId'],
    attrs: ['value'],
});

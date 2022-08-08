const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const util = require('./date-picker/util');
const { isEmpty, isNull } = require('@clubajax/no-dash');
const emitEvent = require('./lib/emitEvent');
const { pad } = require('./date-picker/util');
const connectInput = require('./date-picker/connect-input');
const uid = require('./lib/uid');
require('./ui-month-picker');

const defaultMask = 'XX/XXXX';

class UiMonthInput extends BaseComponent {
    constructor() {
        super();
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

    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this._value = isNull(value) ? defaultValue : value;
        this.onDomReady(() => {
            this.setValue();
        });
    }

    get value() {
        return this.input.value || this._value || defaultValue;
    }

    setValue(month = this.getMonth(), year = this.getYear()) {
        if (typeof month === 'string') {
            this.input.value = month;
            return;
        }
        this._value = `${pad(month)}/${year}`;
        this.typedValue = this._value;
        this.input.value = this._value;
        this.picker.value = this._value;
    }

    getMonth() {
        return parseInt(this.value.split('/')[0], 10);
    }

    getYear() {
        return parseInt(this.value.split('/')[1], 10);
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

    isValid(value = this.input.value) {
        if (value.length !== 7) {
            return false;
        }
        const month = this.getMonth();
        // const year = this.getYear();
        if (month < 1 || month > 12) {
            return false;
        }
        return true;
    }

    validate() {
        if (this.isValid()) {
            this.classList.remove('invalid');
            return true;
        }
        this.classList.add('invalid');
        return false;
    }

    onValidation() {}

    format(value) {
        return util.formatDate(value, this.mask);
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
            this.picker.value = this.value;
            this.emitEvent();
        } else {
            this.reset();
        }
        this.emit('blur');
    }

    reset() {
        this.typedValue = '';
        const value = this.lastValue;
        const month = parseInt(value.split('/')[0], 10);
        const year = parseInt(value.split('/')[1], 10);
        this.setValue(month, year);
    }

    emitEvent() {
        const value = this.value;
        if (value === this.lastValue || !this.isValid(value)) {
            return;
        }
        this.lastValue = value;
        this.emit('change', { value });
    }

    connected() {
        this.render();
        this.connected = () => {};
        this.rendered = true;
    }

    render() {
        if (!this.label) {
            this.innerHTML = '';
            this.appendChild(this.wrapper);
        }
        if (this.label) {
            this.labelNode.innerHTML = this.label;
        } else {
            this.labelNode.parentNode.removeChild(this.labelNode);
        }
        if (this.name) {
            this.input.setAttribute('name', this.name);
        }
        this.lastValue = this.value;
        this.mask = this.mask || defaultMask;
        dom.attr(this.input, 'disabled', this.disabled);
        dom.attr(this.input, 'readonly', this.readonly);

        this.renderPopup();

        this.connect();
    }

    renderPopup() {
        this.popup = dom(
            'ui-popup',
            {
                'align-to': this.alignTo,
                buttonid: this.buttonId,
                align: this.align,
            },
            document.body,
        );

        this.picker = dom(
            'ui-month-picker',
            {
                'event-name': 'picker-change',
                'years-prev': this['years-prev'],
                'years-next': this['years-next'],
                value: this.value,
            },
            this.popup,
        );
    }

    connect() {
        connectInput.call(this);
        this.on(this.input, 'blur', this.onBlur.bind(this), null);
        this.on(this, 'validation', this.onValidation.bind(this), null);
        this.on(this.input, 'change', util.stopEvent, null);
        this.on(this.icon, 'focus', () => {
            this.icon.classList.add('focus');
        });

        this.on(this.picker, 'picker-change', (e) => {
            if (e.detail.month !== this.getMonth()) {
                this.popup.hide();
            }
            this.setValue(e.detail.month, e.detail.year);
            this.emitEvent();
        });
    }
}

const d = new Date();
const defaultValue = `${d.getMonth() + 1}/${d.getFullYear()}`;

module.exports = BaseComponent.define('ui-month-input', UiMonthInput, {
    props: ['label', 'align', 'data', 'years-prev', 'years-next'],
    bools: ['readonly', 'disabled', 'name'],
    attrs: ['value'],
});

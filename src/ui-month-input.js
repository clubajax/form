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
        this.dateType = 'month';
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

    onMin(min) {
        console.log('input.min', min);
    }
    onMax(max) {
        console.log('input.max', max);
    }

    setMinMax() {
        if (!this.min && !this.max) {
            return;
        }
        if (invalidMinMax(this.min, this.max)) {
            console.error('The provided `min` and `max` are invalid');
            return;
        }
    }

    set value(value) {
        // this._value = isNull(value) ? defaultValue : value;
        this._value = value;
        this.onDomReady(() => {
            if (!this._value) {
                this.setValue(null);
            } else {
                this.setValue(this.getMonth(this._value), this.getYear(this._value));
            }
        });
    }

    get value() {
        return this.input.value || this._value;
    }

    setValue(month = this.getMonth(), year = this.getYear()) {
        if (typeof month === 'string') {
            // this.input.value = month;
            this._value = month;
            if (this._value === this.typedValue) {
                return;
            }
            this.typedValue = this._value;
            this.input.value = this._value;
            return;
        }
        if (month) {
            this._value = `${pad(month)}/${year}`;
        }
        this.typedValue = this._value;
        this.input.value = this._value;
        this.picker.value = this._value;
    }

    getMonth(value) {
        const v = value || this.value;
        if (!v) {
            return null;
        }
        return parseInt(v.split('/')[0], 10);
    }

    getYear(value) {
        const v = value || this.value;
        if (!v) {
            return null;
        }
        return parseInt(v.split('/')[1], 10);
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
        if (value) {
            const month = parseInt(value.split('/')[0], 10);
            const year = parseInt(value.split('/')[1], 10);
            this.setValue(month, year);
        }
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
        this.setMinMax();
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
                min: this.min,
                max: this.max,
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

function makeDate(str) {
    const month = parseInt(str.split('/')[0], 10);
    const year = parseInt(str.split('/')[1], 10);
    return new Date(year, month - 1, 1);
}

function invalidMinMax(min, max) {
    if (!min || !max) {
        return false;
    }
    const minDate = makeDate(min);
    const maxDate = makeDate(max);

    return minDate.getTime() > maxDate.getTime();
}

module.exports = BaseComponent.define('ui-month-input', UiMonthInput, {
    props: ['label', 'align', 'data', 'min', 'max'],
    bools: ['readonly', 'disabled', 'name'],
    attrs: ['value'],
});

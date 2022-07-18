const DateInput = require('./date-input');
const dates = require('@clubajax/dates');
const uid = require('../lib/uid');
require('./date-range-picker');

class DateRangeInput extends DateInput {
    constructor() {
        super();
        this.isRangeInput = true;
        this.pickerType = 'date-range-picker';
    }

    get templateString() {
        this.buttonId = uid('button');
        return `
<label>
	<span ref="labelNode"></span>
	<div class="date-input-wrapper">
		<input ref="input" class="empty" />
		<button class="icon-button" id=${this.buttonId} ref="icon"><ui-icon type="calendar" /></button>
    </div>
    <div class="input-error" ref="errorNode"></div>
</label>
<date-range-picker ref="picker" tabindex="0"></date-range-picker>`;
    }

    connected() {
        this.mask = 'XX/XX/XXXX - XX/XX/XXXX';
        this.alignTo = this.input;
        this.align = 'left';
    }

    isValid(value = this.input.value) {
        const ds = (value || '').split(/\s*-\s*/);
        console.log('isValid', value);
        return dates.isDate(ds[0]) && dates.isDate(ds[1]);
    }
}

customElements.define('date-range-input', DateRangeInput, {
    // this is not working, using attr from date-input - why?
    bools: ['independent-pickers'],
});

module.exports = DateRangeInput;

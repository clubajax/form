const BaseComponent = require('@clubajax/base-component');
const dates = require('@clubajax/dates');
const dom = require('@clubajax/dom');
require('./date-input');
require('./date-picker');

// TODO: DateRangeButton

class DateRangePopup extends BaseComponent {
    constructor() {
        super();
        // this.fireOwnDomready = true;
        this.mask = 'XX/XX/XXXX';
        console.log('DateRangePopup');
    }

    connected() {
        this.render();
    }

    render() {}
}

module.exports = BaseComponent.define('date-range-inputs', DateRangePopup, {
    bools: ['range-expands', 'required'],
    props: ['left-label', 'right-label', 'name', 'placeholder'],
    attrs: ['value'],
});

const { BaseComponent, dom, dates } = require('../libs');
require('./date-input');
require('./date-picker');

// TODO: DateRangeButton

class DateRangePopup extends BaseComponent {
    constructor() {
        super();
        // this.fireOwnDomready = true;
        this.mask = 'XX/XX/XXXX';
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

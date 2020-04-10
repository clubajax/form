const BaseComponent = require('@clubajax/base-component');
const UiDropdown = require('./ui-dropdown');
const dom = require('@clubajax/dom');
require('./ui-icon');


class ActionButton extends UiDropdown {
    constructor() {
        super();
        this.popupClass = 'actionbutton';
    }
    setDisplay() {
        if (this.buttonRendered) {
            return;
        }
        if (this.icon) {
            this.button.appendChild(dom('ui-icon', {type: this.icon}));
        }
        if (this.label) {
            this.button.appendChild(dom('ui-icon', {html: this.label}));            
        }
        this.buttonRendered = true;
    }

    // connected() {
    //     super.connected();

    //     let lastValue;
    //     this.on(this['event-name'], (e) => {
    //         console.log('change...', e.detail.value, lastValue);
    //         // if (e.detail.value === lastValue) {
    //         //     return true;
    //         // }
            
    //         if (this.list) {
    //             this.list.clear();
    //         }
    //         return true;
    //     });
    // }
}

module.exports = BaseComponent.define('ui-actionbutton', ActionButton, {
    props: ['icon']
});
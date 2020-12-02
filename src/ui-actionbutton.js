const BaseComponent = require('@clubajax/base-component');
const UiDropdown = require('./ui-dropdown');
const dom = require('@clubajax/dom');
require('./ui-icon');


class ActionButton extends UiDropdown {
    constructor() {
        super();
        this.popupClass = 'actionbutton';
        this.isAction = true;
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

    connectEvents() {
        super.connectEvents();
        this.list.on('list-change', (e) => {
            setTimeout(() => {
                this.list.controller.setSelected(null);
                this.list.lastValue = null;
            }, 30);
        });
    }
}

module.exports = BaseComponent.define('ui-actionbutton', ActionButton, {
    props: ['icon']
});
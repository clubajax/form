const { BaseComponent, dom } = require('./libs');
const UiDropdown = require('./ui-dropdown');
require('./ui-icon');

class ActionButton extends UiDropdown {
    constructor() {
        super();
        this.popupClass = 'actionbutton';
        this.isAction = true;
    }

    setDisplay() {
        // handle react
        if (this.className) {
            const cls = this.className;
            dom.attr(this, 'classname', null);
            this.removeAttribute('classname');
            this.className = '';
            this.button.className = cls;
        }

        if (this['btn-class']) {
            this.button.className = this['btn-class'];
        }

        if (this.buttonRendered) {
            return;
        }
        if (this.icon && !this['icon-after']) {
            this.button.appendChild(dom('ui-icon', { type: this.icon }));
        }
        if (this.label) {
            this.button.appendChild(dom('span', { html: this.label }));
        }
        if (this.icon && this['icon-after']) {
            this.button.appendChild(dom('ui-icon', { type: this.icon }));
        }
        this.buttonRendered = true;
    }

    connectEvents() {
        super.connectEvents();
        this.list.on('list-change', (e) => {
            const item = this.data.find((d) => d.value === e.detail.value);
            if (item && item.callback) {
                item.callback(item);
            }

            setTimeout(() => {
                this.list.controller.setSelected(null);
                this.list.lastValue = null;
            }, 30);
        });
    }
}

module.exports = BaseComponent.define('ui-actionbutton', ActionButton, {
    props: ['icon', 'btn-class'],
    bools: ['icon-after'],
});

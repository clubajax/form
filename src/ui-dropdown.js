const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
const emitEvent = require('./lib/emitEvent');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');

// https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/

const DEFAULT_PLACEHOLDER = 'Select One...';

class UiDropdown extends BaseComponent {

    set value(value) {
        this.onDomReady(() => {
            console.log('set value', value);
            this.list.value = value;
        });
        this.__value = value;
    }

    get value() {
        if (!this.list) {
            return this.__value || this.getAttribute('value');
        }
        return this.list.value;
    }

    set data(data) {
        this.onDomReady(() => {
            console.log('drop.set data');
            this.lastValue = this.value;
            this.list.data = data;
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    setDisplay() {
        this.button.innerHTML = '';
        
        const item = this.list ? this.list.getItem(this.value) : {};
        this.__value = item ? item.value : this.__value;
        dom('span', {html: isNull(this.value) ? this.placeholder || DEFAULT_PLACEHOLDER : (item.alias || item.label)}, this.button);
        dom('ui-icon', {type: 'caretDown'}, this.button);

        setTimeout(() => {
            // don't resize the popup right away - wait until it closes, or it jumps
            if (this.popup) {
                dom.style(this.popup, {
                    'min-width': dom.box(this.button).w
                });
            }
        }, 500);
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', (e) => {
            this.setDisplay();
            if (this.lastValue !== this.value) {
                emitEvent(this);
                this.lastValue = this.value;
            }
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });
        this.popup.on('popup-open', () => {
            this.list.controller.scrollTo();
            this.fire('open');
        });
        this.popup.on('popup-close', () => {
            this.list.controller.scrollTo();
            this.fire('close');
        });
    }

    renderButton(buttonid) {
        this.button = dom('button', {id: buttonid, class: 'ui-button drop-input'}, this);
        this.setDisplay();
    }

    render() {
        this.labelNode = dom('label', {html: this.label, class: 'ui-label'}, this);
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            buttonid,
            'event-name': 'list-change',
            sortdesc: this.sortdesc,
            sortasc: this.sortasc
        });
        this.popup = dom('ui-popup', {
            buttonid,
            label: this.label,
            html: this.list,
            class: 'dropdown'
        }, document.body);
        this.setDisplay();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class', 'sortdesc', 'sortasc'],
    bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
    attrs: ['value']
});

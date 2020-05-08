const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
const emitEvent = require('./lib/emitEvent');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');

// ref
// https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/

// TODO
// popupClass as attribute

const DEFAULT_PLACEHOLDER = 'Select One...';

class UiDropdown extends BaseComponent {
    constructor() {
        super();
        this.sortdesc
        this.sortasc;
        this.label;
        this.placeholder;
        this.lastValue = null;
        this.popupClass = 'dropdown';
    }
     
    set value(value) {
        this.lastValue = value;
        if (this.list) {
            this.list.value = value;
        } else {
            this.onDomReady(() => {
                this.list.value = value;
            });
        }
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
            if (!this.value) {
                const value = getValueFromList(data);
                if (value) {
                    this.value = value;
                }
            }
            this.list.data = data;
            this.setDisplay();

            if (this['size-to-popup'] || this['autosized']) {
                this.sizeToPopup();
            }
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.data : this.__data;
    }

    sizeToPopup() {
        dom.style(this.button, {
            width: dom.box(this.popup).w + 20 // allow for dropdown arrow
        });
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
            // set display, regardless of elligible event
            this.setDisplay();
            // ensure value is not the same,
            // do not emit events for initialization and 
            // externally setting the value
            if (this.lastValue + '' !== this.value + '') {
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

    setDisplay() {
        this.button.innerHTML = '';
        
        const item = this.list ? this.list.getItem(this.value) : {};
        this.__value = item ? item.value : this.__value;
        dom('span', {html: isNull(this.value) ? this.placeholder || DEFAULT_PLACEHOLDER : (item.alias || item.label)}, this.button);
        if (!this['no-arrow']) {
            dom('ui-icon', {type: 'caretDown'}, this.button);
        }
        setTimeout(() => {
            // don't resize the popup right away - wait until it closes, or it jumps
            if (this.popup) {
                dom.style(this.popup, {
                    'min-width': dom.box(this.button).w
                });
            }
        }, 500);
    }

    renderButton(buttonid) {
        this.button = dom('button', {id: buttonid, class: 'ui-button drop-input', type: 'button'}, this);
        if (typeof this.data === 'function') {
            this.once(this.button, 'click', () => {
                this.list.setLazyData();
                this.isLazy = false;
            });
        }
        this.setDisplay();
    }

    render() {
        if (this.label) {
            this.labelNode = dom('label', {html: this.label, class: 'ui-label'}, this);
        }
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
            class: this.popupClass
        }, document.body);
        this.setDisplay();
    }

    disconnected() {
        this.list.destroy();
        this.popup.destroy();
        this.destroy();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

function getValueFromList(data) {
    if (typeof data === 'function') {
        data = data();
    }
    const item = data.find(m => m.selected);
    return item ? item.value : null;
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class', 'sortdesc', 'sortasc'],
    bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy', 'no-arrow', 'size-to-popup', 'autosized'],
    attrs: ['value']
});

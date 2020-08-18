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
        this.sortdesc;
        this.sortasc;
        this.label;
        this.placeholder;
        this.lastValue = null;
        this.popupClass = 'dropdown';
    }

    onDisabled(disabled) {
        this.onDomReady(() => {
            dom.attr(this.button, 'tabindex', disabled ? '-1' : false);
        });
    }

    set value(value) {
        this.lastValue = value;
        if (this.list) {
            this.list.value = value;
        } else {
            this.onDomReady(() => {
                setTimeout(() => {
                    if (this.list && !this.list.lazyDataFN) {
                        this.list.value = value;
                    }
                }, 1);
            });
        }
        this.__value = value;

        // if (this.list && !this.list.getItem(value)) {
        if (this.list) {
            this.setDisplay();
        }
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
            if (this.list) {
                this.list.data = data;
            }
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
            width: dom.box(this.popup).w + 20, // allow for dropdown arrow
        });
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', (e) => {
            if (e.detail.value === this.__value) {
                return;
            }
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

        const value = this.value || this.__value;

        const item = getItemFromList(this.data, value);

        dom(
            'span',
            { html: isNull(item) ? this.placeholder || DEFAULT_PLACEHOLDER : item.alias || item.label },
            this.button
        );
        if (this.icon !== 'none') {
            dom('ui-icon', { type: this.icon || 'caretDown' }, this.button);
        }
        if (this.popup) {
            setTimeout(() => {
                // don't resize the popup right away - wait until it closes, or it jumps
                dom.style(this.popup, {
                    'min-width': dom.box(this.button).w,
                });
            }, 500);
        }
    }

    setLazyData() {
        if (this.lazyDataIsSet) {
            return;
        }
        this.renderPopup();
        this.lazyDataIsSet = true;
        this.isLazy = false;
        this.popup.onDomReady(() => {
            this.popup.show();
        });
    }

    renderButton() {
        this.button = dom('button', { id: this.buttonid, class: 'ui-button drop-input', type: 'button' }, this);
        if (typeof this.data === 'function') {
            this.once(
                this.button,
                'click',
                () => {
                    this.setLazyData();
                },
                null
            );
            this.once(
                this.button,
                'keydown',
                (e) => {
                    if (e.key === 'Enter') {
                        this.setLazyData();
                    }
                },
                null
            );
        }
        this.setDisplay();
    }

    renderPopup() {
        const data = typeof this.data === 'function' ? this.data() : this.data;
        this.list = dom('ui-list', {
            buttonid: this.buttonid,
            'event-name': 'list-change',
            sortdesc: this.sortdesc,
            sortasc: this.sortasc,
            data,
            value: this.value,
        });

        if (this.className) {
            this.popupClass += ' ' + this.className;
        }

        this.popup = dom(
            'ui-popup',
            {
                buttonid: this.buttonid,
                label: this.label,
                html: this.list,
                class: this.popupClass,
            },
            document.body
        );

        this.connectEvents();
    }

    render() {
        if (this.label) {
            this.labelNode = dom('label', { html: this.label, class: 'ui-label' }, this);
        }
        this.buttonid = uid('drop-button');
        this.renderButton();
        if (typeof this.data !== 'function') {
            this.renderPopup();
        }
        this.setDisplay();
    }

    disconnected() {
        if (this.popup) {
            this.list.destroy();
            this.popup.destroy();
        }
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
    const item = data.find((m) => m.selected);
    return item ? item.value : null;
}

function getItemFromList(data, value) {
    if (typeof data === 'function') {
        data = data();
    }
    if (!data) {
        return null;
    }
    return data.find((m) => m.value === value);
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: ['icon', 'placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class', 'sortdesc', 'sortasc'],
    bools: [
        'disabled',
        'open-when-blank',
        'allow-new',
        'required',
        'case-sensitive',
        'autofocus',
        'busy',
        'size-to-popup',
        'autosized',
    ],
    attrs: ['value'],
});

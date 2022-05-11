const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const nodash = require('@clubajax/no-dash');
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

        this.destroyOnDisconnect = !this.noselfdestroy;
        this.isAction = false;
    }

    onDisabled(value) {
        this.onDomReady(() => {
            dom.attr(this.button, 'tabindex', value ? '-1' : false);
        });
    }

    onReadonly(value) {
        this.onDomReady(() => {
            dom.attr(this, 'readonly', value ? 'true' : null);
        });
    }

    set value(value) {
        // blocking an overly aggressive setting of the value
        // this prevents a React bug, when a Select component is
        // in a closure and the state gets updated with a stale
        // value immediately after a new value
        //
        // since above fix, added last condition
        // to prevent being set twice, the first one a blank initialization
        const log = false; //['location', 'belt_rank'].includes(this.name);
        log && console.log('\nset.value', value);
        if (this.blocked || this.lastValue === value || (!value && !this.blocked)) {
            log && console.log('blocked', value, this.blocked, this.lastValue === value);
            return;
        }
        this.blocked = true;
        setTimeout(() => {
            this.blocked = false;
        }, 30);

        this.lastValue = value;
        if (this.list) {
            this.list.value = value;
            log && console.log('list.value', value);
        } else {
            this.onDomReady(() => {
                setTimeout(() => {
                    if (this.list && !this.list.lazyDataFN) {
                        log && console.log('dom.list.value', value);
                        this.list.value = value;
                    }
                }, 1);
            });
        }
        this.__value = value;

        if (this.list) {
            log && console.log('display', value);
            this.setDisplay();
        } else {
            log && console.log('no display list', value);
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

    get mult() {
        return this.multitple || this.persistMultiple;
    }

    sizeToPopup() {
        dom.style(this.button, {
            width: this.popup.width + 20, // allow for dropdown arrow
        });
    }

    reset() {
        this.list.reset();
    }

    clear() {
        this.list.clear();
        this.__value = null;
        this.lastValue = null;
        this.setDisplay();
    }

    connected() {
        this.render();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-click-off', (e) => {
            if (this.button.contains(e.target)) {
                return;
            }
            this.popup.hide();
        });

        this.on(this.button, 'blur', (e) => {
            this.emit('blur', {...e});
         })

        this.list.on('list-change', (e) => {
            // if (isEqual(e.detail.value, this.__value) && !this.isAction) {
            if (!this.isAction && isEqual(e.detail.value, this.__value)) {
                this.popup.hide();
                e.stopImmediatePropagation();
                return;
            }
            // set display, regardless of elligible event
            this.setDisplay();
            // ensure value is not the same,
            // do not emit events for initialization and
            // externally setting the value
            const value = this.value;
            this.lastValue = this.value;

            emitEvent(this, value, getItemFromList(this.data, value));

            if (!this.mult) {
                setTimeout(() => {
                    this.popup.hide();
                }, 300);
            }
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

    beforerender(text) {
        // can be overwritten
        return text;
    }

    setDisplay() {
        this.button.innerHTML = '';

        const value = this.value || this.__value;
        const item = getItemFromList(this.data, value);
        const hasPlaceholder = isNull(item);
        dom.classList.toggle(this.button, 'has-placeholder', hasPlaceholder);
        let text = hasPlaceholder ? this.placeholder || DEFAULT_PLACEHOLDER : item.alias || item.label;
        if (this.beforerender) {
            text = this.beforerender(text);
        }
        dom('span', { html: text }, this.button);
        if (this.icon !== 'none') {
            dom('ui-icon', { type: this.icon || 'caretDown' }, this.button);
        }
        if (this.popup) {
            clearTimeout(this.popTmr);
            this.popTmr = setTimeout(() => {
                // don't resize the popup right away - wait until it closes, else it jumps
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

    lazyListener() {
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
    }

    renderButton() {
        this.button = dom('button', { id: this.buttonid, class: 'ui-button drop-input', type: 'button' }, this);
        this.lazyListener();
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
            multiple: this.multiple,
            'persist-multiple': this.persistMultiple,
        });

        if (this.className) {
            this.popupClass += ' ' + this.className;
        }

        this.popup = dom(
            'ui-popup',
            {
                lazy: !this.noselfdestroy && typeof this.data !== 'function',
                'max-height': this.maxheight || dom.style(this, 'max-height'), 
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
        if (this.label && !this.isAction) {
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
        if (!this.noselfdestroy) {
            setTimeout(() => {
                if (this.DOMSTATE !== 'domready') {
                    this.destroy();
                }
            }, 500);
        }
    }

    destroy() {
        if (this.popup) {
            this.list.destroy();
            this.popup.destroy();
        }
        super.destroy();
    }
}

function isEqual(a, b) {
    if (Array.isArray(a)) {
        return nodash.equal(a, b);
    }
    return `${a}` === `${b}`;
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
    return data.find((m) => `${m.value}` === `${value}`);
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: [
        'icon',
        'placeholder',
        'label',
        'limit',
        'name',
        'event-name',
        'align',
        'btn-class',
        'sortdesc',
        'sortasc',
        'beforerender',
        'maxheight'
    ],
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
        'multiple',
        'persist-multiple',
        'noselfdestroy',
        'readonly'
    ],
    attrs: ['value'],
});

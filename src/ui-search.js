const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const uid = require('./lib/uid');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');
require('./ui-input');

// https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/
// https://adamsilver.io/articles/building-an-accessible-autocomplete-control/
// data-alt

const DEFAULT_PLACEHOLDER = 'Begin typing...';

class UiSearch extends BaseComponent {
    constructor() {
        super();
        this.placeholder;
        this.busy;
        this.label;
    }
    set value(value) {
        this.onDomReady(() => {
            if (this.list) {
                this.list.value = value;
            }
            this.setDisplay();
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
            if (!this.list && !data.length) {
                if (this.popup) {
                    this.popup.hide();
                }
                return;
            }
            this.renderList();
            let updatePopup = false;
            if (this.popup && this.list) {
                updatePopup = this.popup.showing && data.length !== this.list.data.length;
            }
            this.list.data = data;
            if (this.input.focused && !this.isSelecting && data.length) {
                if (this.popup.DOMSTATE === 'connected') {
                    this.popup.onDomReady(() => {
                        this.popup.show(updatePopup);
                    });
                } else {
                    this.popup.show(updatePopup);
                }
            }
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    onDisabled(value) {
        if (this.input) {
            this.input.disabled = value;
        }
    }

    onBusy(value) {
        this.input.icon = value ? 'spinner' : 'search';
    }

    setDisplay() {
        const item = this.list ? this.list.getItem(this.value) : false;
        this.__value = item ? item.value : this.__value;

        this.input.value = item ? (isNull(this.value) ? '' : item.display || item.alias || item.label) : this.__value;

        if (this.popup) {
            dom.style(this.popup, {
                'min-width': dom.box(this.input).w,
            });
        }
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connectInput();
        this.connected = () => {};
    }

    connectInput() {
        this.input.on('keyup', (e) => {
            // meta handles paste
            if (on.isAlphaNumeric(e.key) || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Meta') {
                this.fire('search', { value: this.input.value });
            }
        });

        this.input.on('focus', () => {
            this.classList.add('is-focused');
        });

        this.input.on('focus', () => {
            this.classList.remove('is-focused');
        });
    }

    connectList() {
        this.list.on('list-change', () => {
            this.isSelecting = true;
            this.setDisplay();
            this.emit('change', { value: this.value });
            setTimeout(() => {
                this.popup.hide();
                setTimeout(() => {
                    this.isSelecting = false;
                }, 300);
            }, 300);
        });

        this.popup.on('popup-close', () => {
            this.fire('hide', null, null);
        });
    }

    renderButton(buttonid) {
        this.input = dom(
            'ui-input',
            {
                id: buttonid,
                'event-name': 'input-change',
                class: 'search-input',
                placeholder: this.placeholder || DEFAULT_PLACEHOLDER,
                icon: this.busy ? 'spinner' : 'search',
                autoselect: this.autoselect,
                disabled: this.disabled
            },
            this
        );
        this.input.on('focus', () => {
            this.classList.add('focus');
        });
        this.input.on('blur', () => {
            this.classList.remove('focus');
        });
        this.setDisplay();
    }

    renderList() {
        if (this.list) {
            return;
        }
        this.list = dom('ui-list', {
            'event-name': 'list-change',
            'external-search': true,
            buttonid: this.buttonid,
        });
        this.popup = dom(
            'ui-popup',
            {
                buttonid: this.buttonid,
                label: this.label,
                html: this.list,
                lazy: true
            },
            document.body
        );
        this.connectList();
    }

    render() {
        if (this.label) {
            this.labelNode = dom('label', { html: this.label, class: 'ui-label' }, this);
        }
        this.buttonid = uid('drop-button');
        this.renderButton(this.buttonid);

        this.setDisplay();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-search', UiSearch, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class'],
    bools: [
        'disabled',
        'open-when-blank',
        'allow-new',
        'required',
        'case-sensitive',
        'autofocus',
        'autoselect',
        'busy',
    ],
    attrs: ['value'],
});

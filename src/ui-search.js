const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
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
    set value(value) {
        this.onDomReady(() => {
            this.list.value = value;
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
            this.list.data = data;
            if (this.input.focused) {
                this.popup.show();
            }
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    onBusy(value) {
        this.input.icon = value ? 'spinner' : 'search';
    }

    setDisplay() {
        const item = this.list ? this.list.getItem(this.value) : {};
        this.__value = item ? item.value : this.__value;

        this.input.value = isNull(this.value) ? '' : item.display || item.alias || item.label;

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
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', () => {
            this.setDisplay();
            this.emit('change', {value: this.value});
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });

        this.input.on('key-search', e => {
            this.fire('search', { value: e.detail.value });
        });

        this.input.on('focus', () => {
            this.classList.add('is-focused');
        });
        this.input.on('focus', () => {
            this.classList.remove('is-focused');
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
            },
            this
        );
        this.setDisplay();
    }

    render() {
        this.labelNode = dom(
            'label',
            { html: this.label, class: 'ui-label' },
            this
        );
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            'event-name': 'list-change',
            'external-search': true,
            buttonid,
        });
        this.popup = dom(
            'ui-popup',
            {
                buttonid,
                label: this.label,
                html: this.list,
            },
            document.body
        );
        this.setDisplay();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-search', UiSearch, {
    props: [
        'placeholder',
        'label',
        'limit',
        'name',
        'event-name',
        'align',
        'btn-class',
    ],
    bools: [
        'disabled',
        'open-when-blank',
        'allow-new',
        'required',
        'case-sensitive',
        'autofocus',
        'busy',
    ],
    attrs: ['value'],
});

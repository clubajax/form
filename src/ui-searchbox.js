const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
require('./ui-icon');
require('./ui-input');

const DEFAULT_PLACEHOLDER = 'Begin typing...';

class UiSearchBox extends BaseComponent {
    constructor() {
        super();
        // this.placeholder;
        this.busy;
        this.label;
    }

    connected() {
        this.render();
        this.connectInput();
        this.connected = () => {};
    }

    getIcon() {
        const value = this.input ? this.input.value : this.value;
        return value ? (this.busy ? 'spinner' : 'close') : 'search';
    }

    updateIcon() {
        const value = this.input ? this.input.value : this.value;
        this.input.icon = value ? (this.busy ? 'spinner' : 'close') : 'search';
    }
    connectInput() {
        this.input.on('keyup', (e) => {
            // meta handles paste
            if (on.isAlphaNumeric(e.key) || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Meta') {
                this.emit('search', {value: this.input.value});
                this.updateIcon();
            }
        });

        this.input.on('focus', () => {
            this.classList.add('is-focused');
        });

        this.input.on('focus', () => {
            this.classList.remove('is-focused');
        });

        this.input.on('clear', () => {
            this.fire('search', { value: '' });
        });
    }

    render() {
        // if (this.label) {
        //     this.labelNode = dom('label', { html: this.label, class: 'ui-label' }, this);
        // }
        this.input = dom(
            'ui-input',
            {
                label: this.label,
                // id: buttonid,
                'event-name': 'input-change',
                class: 'search-input',
                placeholder: this.placeholder || DEFAULT_PLACEHOLDER,
                icon: this.getIcon(),
                autoselect: this.autoselect,
                disabled: this.disabled,
                'no-border': true
            },
            this
        );
    }
}

module.exports = BaseComponent.define('ui-searchbox', UiSearchBox, {
    props: ['placeholder', 'label', 'name', 'event-name'],
    bools: ['disabled', 'required', 'case-sensitive', 'autofocus', 'autoselect', 'busy'],
});

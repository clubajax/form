const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
require('./ui-minipop');
require('./ui-input');
require('./ui-checkbox');

class UiCheckList extends BaseComponent {
    constructor() {
        super();
        console.log('UiCheckList');
    }

    set data(data) {
        this.items = data || [];
        console.log('data', data);
    }

    connected() {
        this.render();
        this.connected = () => {};
    }

    connectEvents() {}

    renderButton() {
        this.input = dom(
            'ui-input',
            {
                icon: 'close',
                placeholder: 'Filter List...',
            },
            this
        );

        this.on(this.input, 'click', (e) => {
            if (e.target.localName === 'ui-icon') {
                e.stopImmediatePropagation();
                console.log('CLEAR');
                return;
            }
            this.popup.show();
        });

        if (this.open) {
            setTimeout(() => {
                this.popup.show();
            }, 30)
        }
    }

    renderApply() {
        const applyButton = dom('button', { class: 'ui-button', html: 'Done' });
        dom(
            'div',
            {
                class: 'apply-container',
                html: applyButton,
            },
            this.popup
        );
        this.on(applyButton, 'click', () => {
            this.popup.hide();
        });
    }

    renderList() {
        dom.clean(this.list);
        this.items.forEach((item) => {
            dom(
                'li',
                {
                    html: dom('ui-checkbox', {
                        name: item.value,
                        label: item.label,
                    }),
                },
                this.list
            );
        });
    }

    renderPopup() {
        const data = typeof this.data === 'function' ? this.data() : this.data;

        this.list = dom('ul', {
            class: 'list',
        });

        this.renderList();

        const listWrap = dom('div', {
            class: 'ui-list',
            html: this.list,
        });

        this.popup = dom(
            'ui-minipop',
            {
                html: listWrap,
                class: 'open',
            },
            this
        );

        this.renderApply();

        const clickoff = this.on('clickoff', (e) => {
            this.popup.hide();
        });

        this.popup.on('popup-open', () => {
            clickoff.resume();
        });

        this.popup.on('popup-close', () => {
            clickoff.pause();
        });

        this.connectEvents();
        this.popup.hide();
    }

    render() {
        this.renderButton();
        this.renderPopup();
    }
}

module.exports = BaseComponent.define('ui-checklist', UiCheckList, {
    bools: ['readonly', 'open'],
});

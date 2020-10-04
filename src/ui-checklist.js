const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const arrowKeys = require('./lib/arrowKeys');
require('./ui-minipop');
require('./ui-input');
require('./ui-checkbox');

// search-type:
//      word(default) match start of all words
//      contains: match any point in string
//      line: match start of line

class UiCheckList extends BaseComponent {
    constructor() {
        super();
    }

    set data(data) {
        this.items = data || [];
    }

    getRegExp() {
        const value = this.input.value;
        const searchType = this['search-type'] || 'word';
        switch (searchType) {
            case 'line':
                return new RegExp(`^${value}`, 'i');
            case 'contains':
                return new RegExp(value, 'i');
            case 'word':
            default:
                return new RegExp(`\\b${value}`, 'i');
        }
    }

    filterList() {
        if (!this.input.value) {
            this.renderList(this.items);
            return;
        }
        const regexp = this.getRegExp();
        const items = this.items.filter((item) => {
            return regexp.test(item.label);
        });
        this.renderList(items);
        this.popup.show();
    }

    connected() {
        this.render();
        this.connected = () => {};
    }

    connectEvents() {
        this.arrowHandle = arrowKeys(this.input.input, this.popup);

        this.on(this.input, 'click', (e) => {
            if (e.target.localName === 'ui-icon') {
                e.stopImmediatePropagation();
                return;
            }
            this.popup.show();
        });

        this.on(this.input.input, 'keyup', (e) => {
            console.log('key', e.key);
            this.filterList();
        });
    }

    renderInput() {
        this.input = dom(
            'ui-input',
            {
                icon: 'close',
                placeholder: 'Filter List...',
                'event-name': 'input-change',
            },
            this
        );

        if (this.open) {
            setTimeout(() => {
                this.popup.show();
            }, 30);
        }
    }

    renderList(items) {
        dom.clean(this.list);
        items.forEach((item) => {
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

        this.renderList(this.items);

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
        this.renderInput();
        this.renderPopup();
        this.connectEvents();
    }

    destroy() {
        this.arrowHandle.remove();
    }
}

module.exports = BaseComponent.define('ui-checklist', UiCheckList, {
    bools: ['readonly', 'open'],
    props: ['search-type'],
});

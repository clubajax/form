const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const UiDropdown = require('./ui-dropdown');
const emitEvent = require('./lib/emitEvent');
require('./ui-arrow');
require('./ui-icon');
require('./ui-minipop');


class UiMiniTags extends UiDropdown {
    constructor() {
        super();
        this.popupClass = 'minitags';
        this.persistMultiple = true;
    }

    

    removeTag(id) {
        const node = dom.query(this, `[data-id="${id}"]`);
        if (!node) {
            return;
        }
        dom.destroy(node);
        const value = this.value;
        const index = value.findIndex((v) => v === id);
        value.splice(index, 1);
        this.value = value;
        emitEvent(this);
    }

    getNodeId(node) {
        return dom.attr(node, 'data-id');
    }

    getDisplayIds() {
        return dom.queryAll(this, '.ui-tag').map((n) => this.getNodeId(n));
    }

    renderTag(id, label) {
        dom(
            'div',
            {
                class: 'ui-tag',
                'data-id': id,
                html: [dom('span', { html: label }), this.readonly ? null : dom('ui-icon', { type: 'close' })],
            },
            this.button
        );
    }

    setDisplay() {
        if (this.noDataNode) {
            dom.destroy(this.noDataNode);
        }
        const ids = this.getDisplayIds();
        (this.value || []).forEach((val) => {
            if (!ids.includes(val)) {
                this.renderTag(val, this.data.find((d) => d.value === val).label);
            }
        });

        if (!this.getDisplayIds().length) {
            this.noDataNode = dom('span', {html: 'No tags', class: 'no-tags'}, this.button);
        }
    }

    renderButton() {
        const buttonWrap = dom('div', {class: 'minitag-buttonwrap'}, this);
        this.button = dom('button', {id: this.buttonid, class: 'ui-button minitag-button', type: 'button'}, buttonWrap);
        
        if (!this.readonly) {
            dom('ui-icon', {type: 'caretDown'}, buttonWrap);

            this.on(this.button, 'click', (e) => {
                if (e.target.localName === 'ui-icon') {
                    e.stopImmediatePropagation();
                    const id = this.getNodeId(e.target.parentNode);
                    this.removeTag(id);
                    return;
                }
                this.popup.show();
            });
        }

        this.lazyListener();
        this.currentHeight = dom.box(this).h;
        this.setDisplay();
    }

    renderApply() {
        const applyButton = dom('button', { class: 'ui-button', html: 'Done' });
        dom(
            'div',
            {
                class: 'minitag-apply-container',
                html: applyButton,
            },
            this.popup
        );
        this.on(applyButton, 'click', () => {
            this.popup.hide();
        });
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

        const listWrap = dom('div', {
            class: 'listwrap',
            html: this.list
        });

        if (this.className) {
            this.popupClass += ' ' + this.className;
        }

        this.popup = dom(
            'ui-minipop',
            {
                html: listWrap,
                class: `${this.popupClass} open`,
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
}

module.exports = BaseComponent.define('ui-minitags', UiMiniTags, {
    bools: ['arrow', 'readonly'],
});

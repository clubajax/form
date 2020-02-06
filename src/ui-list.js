const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('./lib/emitEvent');

const ATTR = {
    LABEL: 'aria-label',
    ALIAS: 'alias',
    DISPLAY: 'display',
    SELECTED: 'aria-selected',
    DISABLED: 'disabled',
    TABINDEX: 'tabindex',
    VALUE: 'value',
};

// TODO
// a11y


class UIList extends BaseComponent {
    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this.onDomReady(() => {
            this.setControllerValue(value);
        });
        this.__value = value;
    }

    get value() {
        if (!this.controller) {
            return this.__value || this.getAttribute('value');
        }
        if (this.multiple) {
            return this.controller
                .getSelected()
                .map(node => node.getAttribute('value'));
        }
        const node = this.controller.getSelected();
        if (node) {
            return node.getAttribute('value');
        }
        return this.__value || null;
    }

    set data(value) {
        if (typeof value === 'function') {
            this.lazyDataFN = value;
            this.onConnected(() => {
                this.connect();
            });
            return;
        }
        this.setData(value);
    }

    get data() {
        return this.items;
    }

    setControllerValue(value) {
        if (this.controller) {
            if (Array.isArray(value)) {
                if (!this.multiple) {
                    throw new Error(
                        'Trying to set multiple values without the `multiple` attribute'
                    );
                }
                const selector = value.map(getSelector).join(',');
                this.controller.setSelected(dom.queryAll(this, selector));
            } else {
                this.controller.setSelected(
                    dom.query(this, getSelector(value))
                );
            }
        }
    }
    getItem(value) {
        return this.items
            ? this.items.find(item => item.value === value || `${item.value}` === `${value}`)
            : null;
    }

    onDisabled() {
        if (this.items || this.lazyDataFN) {
            this.connectEvents();
        }
        this.onDomReady(() => {
            this.setTabIndicies();
        });
    }

    onReadonly() {
        this.connectEvents();
    }

    setLazyValue(value) {
        // emits a value, in spite of the list not yet being rendered
        const data = this.lazyDataFN();
        const item = data.find(m => m.value === value);
        if (!item) {
            return;
        }
        this.emitEvent();
    }

    setLazyData() {
        // to be called externally, for example, by a dropdown
        this.setData(this.lazyDataFN());
        this.lazyDataFN = null;
        // I think this should be next:
        this.connectEvents();
        this.fire('dom-update');
    }

    setData(value) {
        value = Array.isArray(value) ? value : [value];
        if (value.length && typeof value[0] !== 'object') {
            value = value.map(item => ({ label: item, value: item }));
        }
        if (!this.lazyDataFN) {
            this.__value = undefined;
        }
        this.selectedNode = null;
        this.update();
        this.items = [...value];
        if (/domready|connected/.test(this.DOMSTATE)) {
            this.setItemsFromData();
        }
    }

    addData(items) {
        items = Array.isArray(items) ? items : [items];
        this.items = [...(this.items || []), ...items];
        this.setItemsFromData();
    }

    removeData(value) {
        value = Array.isArray(value) ? value : [value];
        value.forEach(value => {
            const index = this.items.findIndex(item => item.value === value);
            if (index === -1) {
                console.warn('remove value, not found', value);
            }
            this.items.splice(index, 1);
        });
        this.setItemsFromData();
    }

    setItemsFromData() {
        // uses an array of objects as the list items
        this.render();
        this.list.innerHTML = '';
        if (this.lazyDataFN && !this.items) {
            this.items = [];
        }
        if (dom.isNode(this.items[0])) {
            this.setDomData();
            return;
        }
        const parentValue = this.value;
        const list = this.list;
        let node;
        this.items.forEach(function (item) {
            if (item.type === 'divider') {
                dom('li', {class: 'divider'}, list);
                return;
            }
            if (item.type === 'label') {
                dom('li', {class: 'label', html: item.label}, list);
                return;
            }
            const label = item.alias
                ? `${item.alias}: ${item.label}`
                : item.label;
            if (item.value === undefined && label === undefined) {
                throw new Error(
                    '[ERROR] each items must have a value or a label'
                );
            }
            if (item.value === undefined) {
                node = dom('div', { class: 'label', html: label }, list);
                node.unselectable = true;
                return;
            }
            const options = { html: label, value: item.value };
            const isSelected = item.selected || item.value === parentValue;
            if (isSelected) {
                options['aria-selected'] = true;
            }
            if (item.class) {
                options.class = item.class;
            }
            if (item.disabled) {
                options.disabled = true;
            }
            node = dom('li', options, list);
        });
        this.appendChild(this.list);
        this.update();
        this.connect();
    }

    initDomData() {
        // used only for the children of ui-list as the items
        let postValue;
        const parentValue = this.value;
        this.render();
        this.items = [];
        while (this.children.length) {
            const child = this.children[0];
            if (child.localName !== 'li') {
                console.warn("ui-list children should use LI's");
            }
            this.items.push({
                label: child.textContent,
                value: child.getAttribute(ATTR.VALUE),
            });
            if (
                child.hasAttribute(ATTR.SELECTED) ||
                child.getAttribute(ATTR.VALUE) === parentValue
            ) {
                this.selectedNode = child;
                this.orgSelected = child;
                this.items[this.items.length - 1].selected = true;
                if (!parentValue) {
                    postValue = child.getAttribute(ATTR.VALUE);
                }
            }
            this.list.appendChild(child);
        }

        this.update();
        this.appendChild(this.list);
        this.connect();

        this.disabled = this.hasAttribute(ATTR.DISABLED);

        if (postValue || parentValue) {
            this.select(postValue || parentValue);
        }
    }

    setDomData() {
        // uses array of dom nodes, or document fragment
        // TODO: Do nodes need to be cloned?
        const list = this.list;
        if (this.items[0] && this.items[0].nodeType === 11) {
            // document fragment
            list.appendChild(this.items[0]);
        } else {
            this.items.forEach(node => {
                if (node.localName !== 'li') {
                    throw new Error('list children should be of type "li"');
                }
                if (!node.getAttribute('value')) {
                    node.setAttribute('value', valueify(node.textContent));
                }
                list.appendChild(node);
            });
        }
        this.appendChild(list);
        this.setItemsFromDom();
        this.update();
        this.connect();
    }

    setItemsFromDom() {
        // derives items list from dom 
        this.items = [];
        [...this.list.children].forEach(child => {
            if (child.localName !== 'li') {
                console.warn("ui-list children should use LI's");
            }
            this.items.push({
                label: child.getAttribute(ATTR.LABEL) || child.textContent,
                value: child.getAttribute(ATTR.VALUE),
                alias: child.getAttribute(ATTR.ALIAS),
                display: child.getAttribute(ATTR.DISPLAY),
            });
        });
    }

    connected() {
        if (this.lazyDataFN) {
            this.update();
        }
        if (this.items) {
            this.initDomData = () => {};
            this.setItemsFromData();
        }
    }

    domReady() {
        if (!this.disabled && !this.readyonly) {
            this.onDisabled();
        }
        if (this.items || this.lazyDataFN) {
            return;
        }
        this.initDomData();
    }

    emitEvent() {
        // emits a "change" event
        emitEvent(this, this.value);
    }

    update() {
        // override me
        // called after items insertion, before list insertion
    }

    setTabIndicies() {
        if (!this.list) {
            return;
        }
        if (!this.disabled) {
            this.setAttribute(ATTR.TABINDEX, '-1');
            this.list.setAttribute(ATTR.TABINDEX, '0');
        } else {
            this.removeAttribute(ATTR.TABINDEX);
            this.list.removeAttribute(ATTR.TABINDEX);
        }
    }

    connect() {
        // called after data is set
        this.connectController();
        this.connectEvents();
        this.connect = function() {};
    }

    connectController() {
        const options = {
            canSelectNone: this.getAttribute('can-select-none'),
            multiple: this.multiple,
            searchTime: this.getAttribute('search-time'),
            externalSearch: this['external-search'],
            buttonId: this.buttonid,
        };
        
        this.connectHandles = on.makeMultiHandle([
            this.on('click', () => {
                this.list.focus();
            }),
            this.on('focus', () => {
                this.list.focus();
            }),
            this.on('key-select', () => {
                this.emitEvent();
            }),
        ]);

        this.controller = keys(this.list, options);
        if (this.value) {
            this.setControllerValue(this.value);
        }
    }

    connectEvents() {
        if (this.lazyDataFN) {
            return;
        }
        const enabled = !this.readonly && !this.disabled;
        this.setTabIndicies();
        if (!enabled && !this.controller) {
            return;
        }
        if (!enabled && this.controller) {
            this.controller.pause();
            this.connectHandles.pause();
        } else if (enabled && this.controller) {
            this.controller.resume();
            this.connectHandles.resume();
        }
    }

    reset() {
        this.value = this.__value;
    }

    render() {
        if (!this.labelNode && this.label) {
            // TODO: a11y?
            this.labelNode = dom('label', { html: this.label }, this);
        }
        if (!this.list) {
            this.list = dom('ul', {});
        }
    }

    destroy() {
        super.destroy();
    }
}

function getSelector(val) {
    return `[value="${val}"]`;
}

function valueify(text) {
    return text.replace(/\s/g, '-').toLowerCase();
}

module.exports = BaseComponent.define('ui-list', UIList, {
    props: [
        'label',
        'limit',
        'name',
        'event-name',
        'align',
        'buttonid',
        'external-search',
    ],
    bools: ['disabled', 'readonly', 'multiple'],
    attrs: ['value'],
});

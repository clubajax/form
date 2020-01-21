const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('./lib/emitEvent');

const ATTR = {
    SELECTED: 'aria-selected',
    DISABLED: 'disabled',
    TABINDEX: 'tabindex',
    VALUE: 'value'
};

class UIList extends BaseComponent {
    constructor() {
        super();
    }

    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this.onConnected(() => {
            if (this.list) {
                if (this.multiple) {

                } else if (this.lazyDataFN) {
                    this.setLazyValue(value);
                } else {
                    const selector = `[value=${value}]`;
                    this.controller.setSelected(dom.query(this, selector));
                }
            }
            this.__value = value;
        });
    }

    get value() {
        if (!this.controller) {
            return this.getAttribute('value');
        }
        if (this.multiple) {
            return this.controller.getSelected().map((node) => node.getAttribute('value'));
        }
        const node = this.controller.getSelected();
        if (node) {
            return node.getAttribute('value');
        }
        return null;
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
        console.log('get data');
        return this.items;
    }

    onDisabled(value) {
        if (this.items || this.lazyDataFN) {
            this.connectEvents();
        }
    }

    onReadonly(value) {
        this.connectEvents();
    }

    setLazyValue(value) {
        // emits a value, in spite of the list not yet being rendered
        const data = this.lazyDataFN();
        const item = data.find(m => m.value === value);
        if (!item) {
            return;
        }
        this.emitEvent(value);
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
        if (!Array.isArray(value)) {
            value = [value];
        }
        if (value.length && typeof value[0] !== 'object') {
            value = value.map(item => ({label: item, value: item}));
        }
        if (!this.lazyDataFN) {
            this.__value = undefined;
        }
        this.selectedNode = null;
        this.update();
        this.items = value;
        if (/domready|connected/.test(this.DOMSTATE)) {
            this.setItemsFromData();
        }
    }

    connected() {
        console.log('connected');
        if (this.lazyDataFN) {
            this.update();
        }
        if (this.items) {
            this.setItemsFromDom = () => {};
            this.setItemsFromData(true);
        }
        console.log(' - ', this.innerHTML);
    }

    domReady() {
        console.log('domready');
        if (!this.disabled && !this.readyonly) {
            this.onDisabled();
        }
        if (this.items || this.lazyDataFN) {
            return;
        }
        this.setItemsFromDom();
    }

    setItemsFromDom() {
        console.log('items from dom');
        // uses the children of ui-list as the items
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
                value: child.getAttribute(ATTR.VALUE)
            });
            if (child.hasAttribute(ATTR.SELECTED) || child.getAttribute(ATTR.VALUE) === parentValue) {
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

    setItemsFromData(silent) {
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
        const self = this;
        let node;
        this.items.forEach(function (item) {
            const label = item.alias ? `${item.alias}: ${item.label}` : item.label;
            if (item.value === undefined && label === undefined) {
                throw new Error('[ERROR] each items must have a value or a label');
            }
            if (item.value === undefined) {
                node = dom('div', {class: 'label', html: label}, list);
                node.unselectable = true;
                return;
            }
            const options = {html: label, value: item.value};
            const isSelected = item.selected || item.value === parentValue;
            if (isSelected) {
                options.selected = true;
            }
            if (item.class) {
                options.class = item.class;
            }
            if (item.disabled) {
                options.disabled = true;
            }
            node = dom('li', options, list);
            if (isSelected) {
                if (self.selectedNode) {
                    self.selectedNode.removeAttribute(ATTR.SELECTED);
                }
                self.selectedNode = node;
                self.orgSelected = node;
                if (!parentValue) {
                    self.__value = item.value;
                }
            }
        });
        this.appendChild(this.list);
        this.update();
        this.connect();
    }

    setDomData() {
        // uses array of objects which are dom nodes
        const list = this.list;
        this.items.forEach((node) => {
            if (node.localName !== 'li') {
                throw new Error('list children should be of type "li"');
            }
            if (!node.getAttribute('value')) {
                node.setAttribute('value', valueify(node.textContent));
            }
            list.appendChild(node);
        });
        this.appendChild(list);
        this.update();
        this.connect();
    }

    emitEvent() {
        // emits a "change" event
        emitEvent(this, this.value);
    }

    update() {
        // override me
        // called after items insertion, before list insertion
    }

    connect() {
        console.log('connect');
        this.connectEvents();
        this.connect = function () {};
    }

    setTabIndicies(enabled) {
        if (!this.list) {
            return;
        }
        if (enabled) {
            this.setAttribute(ATTR.TABINDEX, '-1');
            this.list.setAttribute(ATTR.TABINDEX, '0');
        } else {
            this.removeAttribute(ATTR.TABINDEX);
            this.list.removeAttribute(ATTR.TABINDEX);
        }    
    }
    
    connectEvents() {
        console.log('connectEvents');
        if (this.lazyDataFN) {
            return;
        }
        const enabled = !this.readonly && !this.disabled;
        this.setTabIndicies(enabled);
        if (!enabled && !this.controller) {
            return;
        }
        if (!enabled && this.controller) {
            this.controller.pause();
            this.connectHandles.pause();
        } else if (enabled && this.controller) {
            this.controller.resume();
            this.connectHandles.resume();
        } else {
            console.log('this.list', this.list);
            this.controller = keys(this.list, {});
            this.controller.log = true;

            this.connectHandles = on.makeMultiHandle([
                this.on('click', () => {
                    this.list.focus();
                }),
                this.on('focus', () => {
                    this.list.focus();
                }),
                this.on('key-select', (e) => {
                    this.emitEvent();
                })
            ]);
        }
    }

    render() {
        if (!this.labelNode && this.label) {
            // TODO: a11y?
            this.labelNode = dom('label', {html: this.label}, this);
        }
        if (!this.list) {
            this.list = dom('ul', {});
        }
    }

    destroy() {
        super.destroy();
    }
}

function valueify(text){
    return text.replace(/\s/g, '-').toLowerCase();
}
module.exports = BaseComponent.define('ui-list', UIList, {
    props: ['label', 'limit', 'name', 'event-name', 'align'],
    bools: ['disabled', 'readonly', 'multiple'],
    attrs: ['value']
});

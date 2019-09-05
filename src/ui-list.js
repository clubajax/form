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
                this.select(value);
            } else if (this.lazyDataFN) {
                this.setLazyValue(value);
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
        return this.items;
    }

    setLazyValue(value) {
        const data = this.lazyDataFN();
        const item = data.find(m => m.value === value);
        // console.log('setLazyValue', value, item, data);
        if (!item) {
            return;
        }
        this.emitEvent(value);
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
        if (this.DOMSTATE === 'domready' || this.DOMSTATE === 'connected') {
            this.setItemsFromData();
        }
    }

    onDisabled(value) {
        if (value) {
            this.removeAttribute(ATTR.TABINDEX);
            this.list.removeAttribute(ATTR.TABINDEX);
        } else {
            this.setAttribute(ATTR.TABINDEX, '-1');
            this.list.setAttribute(ATTR.TABINDEX, '0');
        }
    }

    connected() {
        if (this.lazyDataFN) {
            this.update();
        }
        if (!this.items) {
            return;
        }
        this.setItemsFromDom = () => {};
        this.setItemsFromData(true);
    }

    domReady() {
        dom.attr(this.list, 'tabindex', 0);
        if (!this.disabled) {
            this.onDisabled();
        }
        if (this.items || this.lazyDataFN) {
            return;
        }
        this.setItemsFromDom();
    }

    setItemsFromDom() {
        let testId;
        let postValue;
        let hasChildren = false;
        const parentValue = this.value;
        this.render();
        while (this.children.length) {
            hasChildren = true;
            if (this.children[0].localName !== 'li') {
                console.warn("drop-down children should use LI's");
            }
            if (this.children[0].hasAttribute(ATTR.SELECTED) || this.children[0].getAttribute(ATTR.VALUE) === parentValue) {
                this.selectedNode = this.children[0];
                this.orgSelected = this.children[0];
                if (!parentValue) {
                    postValue = this.children[0].getAttribute(ATTR.VALUE);
                }
            }
            this.list.appendChild(this.children[0]);
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
        this.render();
        const parentValue = this.value;
        const list = this.list;
        const self = this;
        let node;
        list.innerHTML = '';
        this.items.forEach(function (item) {
            const label = item.alias ? `${item.alias}: ${item.label}` : item.label;
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

    // getItem(value) {
    //     if (this.items) {
    //         for (let i = 0; i < this.items.length; i++) {
    //             if (this.items[i].value === value || this.items[i].label === value) {
    //                 return this.items[i];
    //             }
    //         }
    //     }
    //     return null;
    // }

    // TODO
    // Comment out all code not yet used - probably doing things differently anyway
    // Also, make more use of keys-nav to get and set

    // select(value, silent) {
    //     if (this.__value === value) {
    //         return;
    //     }
    //     const selected = this.selectedNode || dom.query(this.list, `[${ATTR.SELECTED}]`);
    //     if (selected) {
    //         selected.removeAttribute(ATTR.SELECTED);
    //     }
    //     this.selectedNode = dom.query(this.list, `[${ATTR.VALUE}="${value}"]`);
    //     if (this.selectedNode) {
    //         this.selectedNode.setAttribute(ATTR.SELECTED, 'true');
    //     } else {
    //         value = null;
    //     }
    //     this.lastValue = this.__value;
    //     this.__value = value;
    //     this.update();
    //     console.log('select...');
    //     if (!silent) {
    //         this.emitEvent(value);
    //     }
    // }

    // unselect() {
    //     if (this.selectedNode) {
    //         this.selectedNode.removeAttribute(ATTR.SELECTED);
    //     }
    // }

    // updateAfterListChange() {
    //     // TODO: doc this
    //     const parentValue = getValue(this);
    //     this.select(parentValue, true);
    // }

    emitEvent() {
        // emits a "change" event
        emitEvent(this, this.value);
    }

    // isValid() {
    //     return true;
    // }

    // isValidSelection() {
    //     // override me
    //     return true;
    // }

    update() {
        // override me
        // called after items insertion, before list insertion
    }

    // reset() {
    //     const value = this.orgSelected ? this.orgSelected : dom.normalize(this.getAttribute('value'));
    //     this.select(value);
    // }

    // undo() {
    //     if (this.lastValue !== undefined) {
    //         this.select(this.lastValue, true);
    //     }
    // }

    connect() {
        console.log('this.list', this.list);
        this.controller = keys(this.list, {});  
        this.controller.log = true;
        this.on('click', () => {
            this.list.focus();
        });
        this.on('focus', () => {
            this.list.focus();
        });
        this.on('key-select', (e) => {
            // console.log(' *** KEYS', e);
            this.emitEvent();
        });
        // this.controller.pause();
        this.connect = function () {};
        this.controller.log = true;
        this.controller.resume();

        
    }

    render() {
        if (!this.list) {
            this.list = dom('ul', {});
        }
    }

    destroy() {
        super.destroy();
    }
}

module.exports = BaseComponent.define('ui-list', UIList, {
    props: ['label', 'limit', 'name', 'event-name', 'align'],
    bools: ['disabled', 'readonly', 'multiple'],
    attrs: ['value']
});

const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('./lib/emitEvent');
require('./ui-icon');
require('./ui-input');

const ATTR = {
    LABEL: 'aria-label',
    ALIAS: 'alias',
    DISPLAY: 'display',
    SELECTED: 'aria-selected',
    DISABLED: 'disabled',
    TABINDEX: 'tabindex',
    VALUE: 'value',
};

// TODO!!!!
// a11y

class UIList extends BaseComponent {
    constructor() {
        super();
        this.destroyOnDisconnect = false;
        this.sortdesc;
        this.sortasc;
        this.multiple;
        this.readonly;
        this.buttonid;
        this.label;
        this.lastValue = null;
    }
    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    get mult() {
        return this.multitple || this['persist-multiple'];
    }
    
    set value(value) {
        this.lastValue = value;
        this.setControllerValue(value);
        this.__value = value;
    }

    get value() {
        const getValue = () => {
            if (!this.controller) {
                return this.__value || this.getAttribute('value');
            }
            if (this.mult) {
                return toArray(this.controller.getSelected()).map((node) => node.getAttribute('value'));
            }
            const node = this.controller.getSelected();
            if (node) {
                return node.getAttribute('value');
            }
            return this.__value || null;
        };
        
        const v = getValue();
        if (this.mult && v) {
            return v.map(dom.normalize);
        }
        return dom.normalize(v);
    }

    set data(data) {
        if (typeof data === 'function') {
            this.lazyDataFN = data;
            this.onConnected(() => {
                this.render();
                this.connect();
            });
            return;
        }
        this.setData(data);
    }

    get data() {
        if (this.lazyDataFN) {
            return this.lazyDataFN();
        }
        return this.items;
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
        const item = data.find((m) => m.value === value);
        if (!item) {
            return;
        }
        this.emitEvent();
    }

    setLazyData(value) {
        // to be called externally, for example, by a dropdown
        this.setData(this.lazyDataFN());
        this.lazyDataFN = null;
        // I think this should be next:
        this.connectEvents();
        if (value) {
            this.value = value;
        }
        this.fire('dom-update');
    }

    setData(data) {
        if (isEqual(this.orgData, data)) {
            return;
        }
        data = toArray(data);
        if (data.length && typeof data[0] !== 'object') {
            data = data.map((item) => ({ label: item, data: item }));
        }
        if (!this.lazyDataFN) {
            this.__value = undefined;
        }
        this.selectedNode = null;
        this.orgData = [...data];
        this.items = sort([...data], this.sortdesc, this.sortasc);
        this.classList.remove('has-selected');
        this.update();
        this.onConnected(() => {
            this.setItemsFromData();
            // this.controller.setSelected(open.getSelected());
        });
    }

    addData(data) {
        data = toArray(data);
        this.items = [...(this.items || []), ...data];
        this.setItemsFromData();
    }

    removeData(values) {
        values = toArray(values);
        values.forEach((value) => {
            const index = this.items.findIndex((item) => item.value === value);
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
                dom('li', { class: 'divider' }, list);
                return;
            }
            if (item.type === 'label') {
                dom('li', { class: 'label', html: item.label }, list);
                return;
            }
            const label = item.alias ? `${item.alias}: ${item.label}` : item.label;
            // if (item.value === undefined && label === undefined) {
            //     throw new Error(
            //         '[ERROR] each items must have a value or a label'
            //     );
            // }
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
        if (this.editNode) {
            this.appendChild(this.editNode);
        }
        this.update();
        this.connect();
        if (this.afterData) {
            this.afterData();
        }
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

        // if (postValue || parentValue) {
        //     this.select(postValue || parentValue);
        // }
    }

    setDomData() {
        // uses array of dom nodes, or document fragment
        // TODO: Do nodes need to be cloned?
        const list = this.list;
        if (this.items[0] && this.items[0].nodeType === 11) {
            // document fragment
            list.appendChild(this.items[0]);
        } else {
            this.items.forEach((node) => {
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
        [...this.list.children].forEach((child) => {
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

    setControllerValue(value) {
        if (this.controller) {
            if (Array.isArray(value)) {
                if (!this.mult) {
                    throw new Error('Trying to set multiple values without the `multiple` attribute');
                }
                const selector = value.map(getSelector).join(',');
                this.controller.setSelected(selector ? dom.queryAll(this, selector) : null);
            } else {
                const r = dom.query(this, getSelector(value));
                this.controller.setSelected(r);
            }
        }
    }

    getItem(value = this.value) {
        let items = this.lazyDataFN ? this.lazyDataFN() : this.items;
        return items ? items.find((item) => item.value === value || `${item.value}` === `${value}`) : null;
    }

    getNode(value = this.value) {
        return dom.query(this.list, `[value='${value}']`);
    }

    getIndex(value = this.value) {
        value = `${value}`;
        return this.items ? this.items.findIndex((item) => `${item.value}` === value) : -1;
    }

    connected() {
        if (this.lazyDataFN) {
            this.update();
        }
        if (this.items) {
            this.initDomData = () => {};
            // this.setItemsFromData();
        }
    }

    domReady() {
        if (!this.disabled && !this.readonly) {
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
        this.connect = function () {};
    }

    clear() {
        this.blockEvent = true;
        this.controller.setSelected(null);

        this.blockEvent = false;
    }

    connectController() {
        const options = {
            canSelectNone: this.getAttribute('can-select-none'),
            multiple: this.multiple,
            persistMultiple: this['persist-multiple'],
            searchTime: this.getAttribute('search-time'),
            externalSearch: this['external-search'],
            buttonId: this.buttonid,
            value: this.value,
        };
        this.connectHandles = on.makeMultiHandle([
            this.on('click', () => {
                this.list.focus();
            }, null, null),
            this.on('focus', () => {
                this.list.focus();
            }, null, null),
            this.on('key-select', () => {
                if (isNull(this.value)) {
                    return;
                }
                const changed = this.value !== this.lastValue;
                this.lastValue = this.value;
                dom.classList.toggle(this, 'has-selected', !!this.value);
                if (changed) {
                    this.emitEvent();
                }
            }, null, null),
        ]);

        this.controller = keys(this.list, options);
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

    editRowRemove() {
        this.afterData = () => {
            if (index < this.items.length) {
                this.value = this.items[index].value;
            } else if (this.items.length) {
                this.value = this.items[0].value;
            }
        };
        const index = this.getIndex();
        this.fire('remove', { value: this.value }, false);
    }

    editRowEdit() {
        const item = this.getItem(this.value);
        const node = this.getNode(this.value);
        if (!item) {
            return;
        }
        this.controller.setSelected(null);
        this.readonly = true;
        this.connectEvents();
        createInput(node, item, true, () => {
            this.readonly = false;
            this.connectEvents();
            this.fire('edit', { value: item });
        });
    }

    editRowAdd() {
        const item = {
            value: Infinity,
            label: '',
        };
        const node = dom('li', {});
        let index = this.getIndex();
        if (index > -1) {
            const refNode = this.getNode();
            dom.insertAfter(refNode, node);
        } else {
            index = this.items.length - 1;
            this.list.appendChild(node);
        }

        this.controller.setSelected(null);

        this.readonly = true;
        this.connectEvents();
        createInput(node, item, false, () => {
            this.readonly = false;
            this.connectEvents();
            this.afterData = () => {
                // select
                this.value = item.value;
            };
            this.fire('add', { value: item, index: index + 1 }, null);
        });
    }

    render() {
        if (!this.labelNode && this.label) {
            // TODO: a11y?
            this.labelNode = dom('label', { html: this.label }, this);
        }
        if (!this.list) {
            this.list = dom('ul', {});
        }
        if (this.editable && !this.editNode) {
            this.editNode = dom(
                'div',
                {
                    class: 'edit-bar',
                    html: [
                        dom('button', {
                            type: 'button',
                            'data-edit': true,
                            class: 'btn-list-edit',
                            html: dom('ui-icon', { type: 'edit' }),
                        }),
                        dom('button', {
                            type: 'button',
                            'data-remove': true,
                            class: 'btn-list-edit',
                            html: dom('ui-icon', { type: 'trash' }),
                        }),
                        dom('button', {
                            type: 'button',
                            'data-add': true,
                            class: 'btn-list-add',
                            html: dom('ui-icon', { type: 'plus' }),
                        }),
                    ],
                },
                this
            );
            this.on(this.editNode, 'click', 'button', (e) => {
                const node = e.target.closest('button');
                if (node.hasAttribute('data-add')) {
                    this.editRowAdd();
                } else if (node.hasAttribute('data-remove')) {
                    this.editRowRemove();
                } else if (node.hasAttribute('data-edit')) {
                    this.editRowEdit();
                }
            });
        }
    }

    destroy() {
        if (this.controller) {
            this.controller.destroy();
        }
        super.destroy();
    }
}

function isNull(value) {
    return value === null || value === undefined || (Array.isArray(value) && !value.length);
}

const SPACE = '&nbsp;';
function toHtml(value, formatter) {
    if (value === null || value === undefined || value === '') {
        return SPACE;
    }
    return value;
}

function fromHtml(value) {
    value = value === SPACE ? '' : value;
    return value;
}

function createInput(node, item, isEdit, callback) {
    const value = item.label;
    node.classList.add('is-editing');
    node.innerHTML = '';
    let exitTimer;
    const input = dom(
        'ui-input',
        {
            value: fromHtml(value),
        },
        node
    );

    input.onDomReady(() => {
        input.input.focus();
        input.on('blur', () => {
            // destroy();
        });
    });

    const destroy = () => {
        node.classList.remove('is-editing');
        input.destroy();
        callback();
    };

    input.on('keyup', (e) => {
        exitTimer = setTimeout(() => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                destroy();
            }
        }, 1);
    });

    // if added and input is empty, don't close on blur
    input.on('change', (e) => {
        e.stopPropagation();
        // node.innerHTML = toHtml(e.value);

        item.label = e.value;
        if (!isEdit) {
            item.value = e.value;
        }
        destroy();
        // on.emit(node, 'change', { value: item });
        clearTimeout(exitTimer);
    });
}

function toArray(data) {
    if (!data) {
        return [];
    }
    return Array.isArray(data) ? data : [data];
}

function getSelector(val) {
    return `[value="${val}"]`;
}

function valueify(text) {
    return text.replace(/\s/g, '-').toLowerCase();
}

function sort(items, desc, asc) {
    if (desc) {
        items.sort((a, b) => (a[desc] > b[desc] ? 1 : -1));
    }
    if (asc) {
        items.sort((a, b) => (a[asc] < b[asc] ? 1 : -1));
    }
    return items;
}

function isEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (!a || !b || !Array.isArray(a) || !Array.isArray(b)) {
        return false;
    }
    return a.map((m) => m.value).join(',') === b.map((m) => m.value).join(',');
}

function noValues(data) {
    // no data is okay
    if (!data.length) {
        return false;
    }
    if (dom.isNode(data[0])) {
        return false;
    }
    // custom app expects IDs
    return !data.find((d) => !!d.value || !!d.id);
}

module.exports = BaseComponent.define('ui-list', UIList, {
    props: ['label', 'limit', 'name', 'event-name', 'align', 'buttonid', 'external-search', 'sortdesc', 'sortasc'],
    bools: ['disabled', 'readonly', 'multiple', 'persist-multiple', 'editable'],
    attrs: ['value'],
});

const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const paginate = require('./lib/paginate');
require('./ui-dropdown');
require('./ui-icon');

const DEFAULT_DROP_DATA = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
];
class Paginator extends BaseComponent {
    onData(data) {
        this.pagination = paginate(data.start, data.limit, data.total);
        this.setDropdown();
        this.renderPageNumbers();
        this.setStatus();
    }
    onLimits(limits) {
        if (typeof limits === 'string') {
            this.dropData = limits.split(',').map((amt) => ({
                label: amt.trim(),
                value: parseInt(amt),
            }));
        } else if (!Array.isArray(limits)) {
            throw new Error('`limits` is expected to be an array or comma-delineated string');
        }
        
        this.setDropdown();
    }
    domReady() {
        this.render();
    }

    renderPageNumbers() {
        if (!this.pageNumbers || !this.pagination) {
            return;
        }
        console.log('nums', this.pagination.buttons);
        this.pagination.buttons.forEach((num) => {
            renderNumButton(num, this.pageNumbers)
        });
    }

    setStatus() {
        if (!this.statusNode || !this.pagination) {
            return;
        }
        this.statusNode.textContent = this.pagination.status;
    }
    setDropdown() {
        if (!this.limitDrop) {
            return;
        }
        const data = this.dropData || DEFAULT_DROP_DATA;
        const value = this.data ? this.data.limit : data[0].value;
        this.limitDrop.data = data;
        this.limitDrop.value = value;
    }
    renderDropdown() {
        this.limitDrop = dom(
            'ui-dropdown',
            {
                'no-arrow': true,
                class: 'thin',
            },
            this
        );
        this.setDropdown();
    }

    render() {
        dom('div', { class: 'dropdown-label', html: 'Rows per page:' }, this);
        this.renderDropdown();
        this.statusNode = dom('div', {class: 'rows-label'}, this);
        this.setStatus();
        this.leftButton = dom(
            'button',
            {
                class: 'ui-button left',
                html: dom('ui-icon', { type: 'angleLeft' }),
            },
            this
        );
        this.pageNumbers = dom('div', {class: 'page-numbers'}, this);
        this.renderPageNumbers();
        this.rightButton = dom(
            'button',
            {
                class: 'ui-button right',
                html: dom('ui-icon', { type: 'angleRight' }),
            },
            this
        );
    }
}

function renderNumButton(num, parent) {
    if (!num) {
        dom('div', {class: 'page-number-dots', html: '...'}, parent);
        return;
    }
    dom('button', { class: 'page-number', html: num, 'data-value': num }, parent);
}

module.exports = BaseComponent.define('ui-paginator', Paginator, {
    props: ['data', 'limits'],
    bools: [],
});

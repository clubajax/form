const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const paginate = require('./lib/paginate');
const emitEvent = require('./lib/emitEvent');
require('./ui-dropdown');
require('./ui-icon');

const DEFAULT_DROP_DATA = [
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
        this.setDisplayState();
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

    emitEvent(value) {
        if (isDataEqual(value.value, this.data)) {
            return;
        }
        this.data = {
            start: value.value.start,
            limit: value.value.limit,
            total: value.value.total
        }
        emitEvent(this, value);
    }

    onDropChange(e) {
        if (e.detail) {
            this.emitEvent({
                value: {
                    ...this.data,
                    start: 0,
                    limit: e.detail.value,
                },
            });
        }
    }

    onNumClick(e) {
        let num = e.target.getAttribute('data-value');
        if (num) {
            num = parseInt(num || e, 10);
            this.emitEvent({
                value: {
                    ...this.data,
                    start: ((num - 1) * this.data.limit),
                },
            });
        }
    }

    onLeftClick() {
        this.emitEvent({
            value: {
                ...this.data,
                start: this.pagination.prev(),
            },
        });
    }

    onRightClick() {
        this.emitEvent({
            value: {
                ...this.data,
                start: this.pagination.next(),
            },
        });
    }

    setStatus() {
        if (!this.statusNode || !this.pagination) {
            return;
        }
        let txt = this.pagination.status;
        this.statusNode.textContent = txt;
    }

    setDisplayState() {
        if (!this.leftButton) {
            return;
        }
        const { buttonIndex } = this.pagination;
        const { start, total, limit } = this.data;
        const dropData = (this.dropData || DEFAULT_DROP_DATA).map((d) => parseInt(d.value, 10));
        const minDropValue = Math.min(...dropData);
        const showButtons = total > limit;

        // looks right. But seeing the dropdown in a few edge cases where we should not
        const showDropdown = limit > minDropValue || showButtons;

        //console.log('pag', `(${minDropValue})`, start, total, limit);
        
        // NOT right. Hide the dropdown when you select 100 results
        // const showDropdown = showButtons;
        const leftDisabled = buttonIndex === 0;
        const rightDisabled = start + limit >= total;
        const showExtraStatus = !showButtons && !showDropdown;

        this.leftButton.disabled = leftDisabled;
        this.rightButton.disabled = rightDisabled;

        dom.classList.toggle(this, 'hide-dropdown', !showDropdown);
        dom.classList.toggle(this, 'hide-buttons', !showButtons);
        dom.classList.toggle(this, 'show-extra-status', showExtraStatus);
    }

    renderPageNumbers() {
        if (!this.pageNumbers || !this.pagination) {
            return;
        }
        this.pageNumbers.innerHTML = '';
        this.pagination.buttons.forEach((num, i) => {
            renderNumButton(num, this.pageNumbers, parseInt(num, 10) === this.pagination.buttonIndex + 1);
        });
    }

    setDropdown() {
        if (!this.limitDrop) {
            return;
        }
        const data = this.dropData || DEFAULT_DROP_DATA;
        const value = getValue(this.data, data);
        this.limitDrop.data = data;
        this.limitDrop.value = value;
    }

    connectEvents() {
        if (this.multiHandle) {
            this.multiHandle.remove();
        }
        this.multiHandle = on.makeMultiHandle([
            on(this.leftButton, 'click', this.onLeftClick.bind(this), null),
            on(this.rightButton, 'click', this.onRightClick.bind(this), null),
            on(this.pageNumbers, 'click', this.onNumClick.bind(this), null),
        ]);
    }
    renderDropdown() {
        this.limitDrop = dom(
            'ui-dropdown',
            {
                'no-arrow': true,
                'event-name': 'drop-change',
                class: 'thin',
            },
            this
        );
        this.on('drop-change', this.onDropChange.bind(this), null, null);
        this.setDropdown();
    }

    render() {
        dom('div', { class: 'dropdown-label', html: 'Rows per page:' }, this);
        this.renderDropdown();

        this.extraStatusNode = dom('span', { html: 'Showing results:', class: 'extra-status' });
        this.statusNode = dom('span', { class: 'main-status' });
        dom(
            'div',
            {
                class: 'rows-label',
                html: [this.extraStatusNode, this.statusNode],
            },
            this
        );
        this.setStatus();

        this.leftButton = dom(
            'button',
            {
                class: 'ui-button left',
                html: dom('ui-icon', { type: 'caretLeft' }),
            },
            this
        );
        this.pageNumbers = dom('div', { class: 'page-numbers' }, this);
        this.renderPageNumbers();
        this.rightButton = dom(
            'button',
            {
                class: 'ui-button right',
                html: dom('ui-icon', { type: 'caretRight' }),
            },
            this
        );

        this.connectEvents();

        this.setDisplayState();
    }

    destroy() {
        if (this.multiHandle) {
            this.multiHandle.remove();
        }
    }
}

function getValue(data, dropData) {
    const value = data ? data.limit : dropData[0].value;
    if (!dropData.find((d) => `${d.value}` === `${value}`)) {
        return dropData[0].value;
    }
    return `${value}`;
}

function renderNumButton(num, parent, disabled) {
    if (!num) {
        dom('div', { class: 'page-number-dots', html: '...' }, parent);
        return;
    }
    dom('button', { class: 'ui-button page-number', html: num, 'data-value': num, disabled }, parent);
}

function isDataEqual(a, b) {
    return a.start === b.start && a.limit === b.limit && a.total === b.total;
}

module.exports = BaseComponent.define('ui-paginator', Paginator, {
    props: ['data', 'limits'],
    bools: ['disabled'],
});

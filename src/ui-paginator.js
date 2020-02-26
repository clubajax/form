const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
require('./ui-dropdown');
require('./ui-icon');

const DEFAULT_DROP_DATA = [
    {label: '5', value: '5'},
    {label: '10', value: '10'},
    {label: '20', value: '20'},
    {label: '50', value: '50'},
    {label: '100', value: '100'},
]
class Paginator extends BaseComponent {

    domReady() {
        this.render();
    }

    renderPageNumbers() {
        dom('div', {class: 'ui-paginator-number', html: '1'}, this);
        dom('div', {class: 'ui-paginator-number', html: '2'}, this);
        dom('div', {class: 'ui-paginator-number', html: '3'}, this);    
    }

    render() {
        dom('div', {class: 'ui-paginator-dropdown-label', html: 'Rows per page:'}, this);
        dom('ui-dropdown', {data: DEFAULT_DROP_DATA, value: '5', 'no-arrow': true, class: 'thin'}, this);
        dom('div', {class: 'ui-paginator-rows-label', html: '31-40 of 947'}, this);
        this.leftButton = dom('button', {class: 'ui-button ui-paginator-button left', html: '<'}, this);
        // dom('ui-icon', {type: 'angleLeft'}, this.leftButton);
        this.renderPageNumbers();
        this.rightButton = dom('button', {class: 'ui-button ui-paginator-button right'}, this);
        dom('ui-icon', {type: 'angleRight'}, this.rightButton);
    }
}

module.exports = BaseComponent.define('ui-paginator', Paginator, {
	props: ['data'],
	bools: []
});
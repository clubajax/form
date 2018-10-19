const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const iconMap = require('./lib/icon-map');

class Icon extends BaseComponent {
    onType(type) { 
        if (!iconMap[type]) {
            console.warn('icon type missing:', type);
            return;
        }
        dom.classList.add(this, iconMap[type]);
    }
}

module.exports = BaseComponent.define('ca-icon', Icon, {
    props: ['type']
});
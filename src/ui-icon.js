const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const iconMap = require('./lib/icon-map');

class Icon extends BaseComponent {
    onType(type) { 
        if (!iconMap[type]) {
            console.warn('icon type missing:', type);
            return;
        }
        if (!missingStylesheet()) {
            console.warn('Icon stylesheet missing');
        }
        this.className = iconMap[type];
    }
}

module.exports = BaseComponent.define('ui-icon', Icon, {
    props: ['type']
});

let missing;
function missingStylesheet() {
    missing = missing !== undefined ? missing : Boolean(dom.queryAll('link').find(link => /fontawesome/.test(link.href)));
    return missing;
}

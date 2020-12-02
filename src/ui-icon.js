const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const iconMap = require('./lib/icon-map');

class UiIcon extends BaseComponent {
    onType(type) { 
        if (!missingStylesheet()) {
            console.warn('Icon stylesheet missing');
        }
        this.className = iconMap[type] || type;
    }
    onColor(value) {
        // why doesn't this work?
        console.log('COLOR', value);
    }

    connected() {
        if (this.color) {
            this.style.color = this.color;
        }
    }
}

let missing;
function missingStylesheet() {
    missing = missing !== undefined ? missing : Boolean(dom.queryAll('link').find(link => /fontawesome/.test(link.href)));
    return missing;
}

module.exports = BaseComponent.define('ui-icon', UiIcon, {
    props: ['type', 'color']
});

const { BaseComponent, dom, on } = require('./libs');

class UiDrawer extends BaseComponent {
    constructor() {
        super();
        this.isOpen = true;
    }

    set open(_open) {
        this.isOpen = _open;
        this.setOpen(_open);
    }

    get open() {
        return this.isOpen;
    }

    setOpen(_open) {
        const dim = this.vertical ? 'height' : 'width';
        if (!_open) {
            if (!this.style[dim]) {
                setSize(this, dim);
            }
            setTimeout(() => {
                dom.style(this, {
                    [dim]: this['closed-size'] || 0,
                });
            }, 1);
        } else {
            getSize(this);
            setTimeout(() => {
                dom.style(this, {
                    [dim]: getSize(this)[dim],
                });
            }, 1);
        }
    }

    connected() {
        const isOpen = dom.normalize(dom.attr(this, 'open'));
        if (isOpen === false) {
            this.isOpen = false;
            this.setOpen(false);
        }
        this.classList.add('animate');
        this.classList.add('show');

        this.on('transitionend', () => {
            const eventName = this.isOpen ? 'open' : 'closed';
            this.emit(eventName);
        });
    }
}

function setSize(node, dim) {
    node.openWidth = node.offsetWidth;
    node.openHeight = node.offsetHeight;
    if (dim === 'width') {
        dom.style(node, 'width', node.openWidth);
    } else {
        dom.style(node, 'height', node.offsetHeight);
    }
}

function getSize(node) {
    if (!node.openWidth) {
        node.classList.remove('animate');
        const widthStyle = dom.style(node, 'width');
        const heightStyle = dom.style(node, 'height');
        dom.style(node, {
            width: '',
            height: '',
        });
        node.openWidth = node.offsetWidth;
        node.openHeight = node.offsetHeight;
        node.classList.add('animate');
        dom.style(node, {
            width: widthStyle,
            height: heightStyle,
        });
    }
    return {
        width: node.openWidth,
        height: node.openHeight,
    };
}

module.exports = BaseComponent.define('ui-drawer', UiDrawer, {
    props: ['closed-size'],
    bools: ['vertical'],
});

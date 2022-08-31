const { on, dom } = require('../libs');

function arrowKeys(input, popup) {
    const h1 = on(input, 'keyup', (e) => {
        if (e.key === 'ArrowDown') {
            e.stopImmediatePropagation();
            dom.query(popup, 'ui-checkbox').focus();
        }
        if (e.key === 'ArrowUp') {
            e.stopImmediatePropagation();
            const inputs = dom.queryAll(popup, 'ui-checkbox');
            inputs[inputs.length - 1].focus();
            inputs[inputs.length - 1].scrollIntoView();
        }
    });
    const h2 = on(popup, 'keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.stopImmediatePropagation();
            e.preventDefault();
            const inputs = dom.queryAll(popup, 'ui-checkbox');
            const input = document.activeElement;
            const index = inputs.findIndex((inp) => inp === input);
            if (index + 1 >= inputs.length) {
                inputs[0].focus();
            } else {
                inputs[index + 1].focus();
            }
        }
        if (e.key === 'ArrowUp') {
            e.stopImmediatePropagation();
            e.preventDefault();
            const inputs = dom.queryAll(popup, 'ui-checkbox');
            const input = document.activeElement;
            const index = inputs.findIndex((inp) => inp === input);
            if (index - 1 < 0) {
                inputs[inputs.length - 1].focus();
            } else {
                inputs[index - 1].focus();
            }
        }
    });

    return on.makeMultiHandle([h1, h2]);
}

module.exports = arrowKeys;

const BaseComponent = require('@clubajax/base-component');

console.log('BaseComponent', BaseComponent);
class UiArrow extends BaseComponent {}

module.exports = BaseComponent.define('ui-arrow', UiArrow, {});

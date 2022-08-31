if (IS_JK) {
    module.exports = {
        BaseComponent: require('@janiking-org/base-component'),
        dom: require('@janiking-org/dom'),
        on: require('@janiking-org/on'),
        dates: require('@janiking-org/dates'),
        keys: require('@janiking-org/key-nav'),
        nodash: require('@janiking-org/no-dash'),
    };
} else {
    module.exports = {
        BaseComponent: require('@clubajax/base-component'),
        dom: require('@clubajax/dom'),
        on: require('@clubajax/on'),
        dates: require('@clubajax/dates'),
        nodash: require('@clubajax/no-dash'),
        keys: require('@clubajax/key-nav'),
    };
}
